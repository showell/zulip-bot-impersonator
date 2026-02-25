import type { ZulipEvent } from "./backend/event";
import type { Message } from "./backend/db_types";

import { EventFlavor } from "./backend/event";

import type { Address } from "./address";
import type { ChannelList } from "./channel_list";
import type { MessageList } from "./message_list";
import type { MessageView } from "./message_view";
import type { PluginHelper } from "./plugin_helper";
import type { ChannelRow, TopicRow } from "./row_types";
import type { TopicList } from "./topic_list";

import { ButtonPanel } from "./nav_button_panel";
import { ChannelPane } from "./channel_pane";
import { ChannelView } from "./channel_view";
import { PaneManager } from "./pane_manager";
import { StatusBar } from "./status_bar";

function narrow_label(
    channel_name: string | undefined,
    topic_name: string | undefined,
    unread_count: number,
): string {
    let label: string;

    if (topic_name !== undefined) {
        label = "> " + topic_name;
    } else if (channel_name !== undefined) {
        label = "#" + channel_name;
    } else {
        label = "Channels";
    }

    const prefix = unread_count === 0 ? "" : `(${unread_count}) `;

    return prefix + label;
}

export class SearchWidget {
    div: HTMLElement;
    button_panel: ButtonPanel;
    pane_manager: PaneManager;
    channel_pane: ChannelPane;
    channel_view?: ChannelView;
    plugin_helper?: PluginHelper;
    start_address: Address;

    constructor(address: Address) {
        const self = this;

        this.start_address = address;

        const div = document.createElement("div");

        const button_panel = new ButtonPanel(self);
        const pane_manager = new PaneManager();

        const channel_pane = new ChannelPane(self);
        pane_manager.add_pane({
            key: "channel_pane",
            pane_widget: channel_pane,
        });

        div.innerHTML = "";

        div.append(button_panel.div);
        div.append(pane_manager.div);

        this.button_panel = button_panel;
        this.pane_manager = pane_manager;
        this.channel_pane = channel_pane;
        this.div = div;
    }

    fork(): void {
        const channel_id = this.get_channel_id();
        const topic_id = this.get_topic_id();
        const address = { channel_id, topic_id };
        const new_search_widget = new SearchWidget(address);
        this.plugin_helper!.add_plugin(new_search_widget);
    }

    refresh_message_ids(message_ids: number[]): void {
        this.channel_pane.populate();
        if (this.channel_view) {
            this.channel_view.refresh_message_ids(message_ids);
        }
    }

    handle_incoming_message(message: Message): void {
        this.channel_pane.populate();
        if (this.channel_view) {
            this.channel_view.refresh(message);
        }
    }

    start(plugin_helper: PluginHelper) {
        const start_address = this.start_address;
        this.plugin_helper = plugin_helper;

        if (start_address.topic_id) {
            if (start_address.channel_id === undefined) {
                throw new Error("unexpected");
            }
            this.get_channel_list().select_channel_id(start_address.channel_id);
            this.update_channel();
            this.channel_view!.select_topic_id(start_address.topic_id);
            this.update_topic();
            return;
        }

        if (start_address.channel_id) {
            this.get_channel_list().select_channel_id(start_address.channel_id);
            this.update_channel();
            return;
        }

        this.update_button_panel();
        this.button_panel.start();
        StatusBar.inform("Begin finding messages by clicking on a channel.");
        this.update_label();
    }

    get_channel_list(): ChannelList {
        return this.channel_pane.get_channel_list();
    }

    get_topic_list(): TopicList | undefined {
        if (this.channel_view === undefined) {
            return undefined;
        }
        return this.channel_view.get_topic_list();
    }

    get_topic_row(): TopicRow | undefined {
        const topic_list = this.get_topic_list();

        if (topic_list === undefined) {
            return undefined;
        }

        return topic_list.get_topic_row();
    }

    get_topic_name(): string | undefined {
        const topic_row = this.get_topic_row();
        return topic_row?.name();
    }

    get_message_list(): MessageList | undefined {
        if (this.channel_view === undefined) {
            return undefined;
        }
        return this.channel_view.get_message_list();
    }

    topic_selected(): boolean {
        if (this.channel_view === undefined) {
            return false;
        }
        return this.channel_view.topic_selected();
    }

    channel_selected(): boolean {
        return this.channel_pane.channel_selected();
    }

    build_main_section(): HTMLElement {
        const div = document.createElement("div");
        div.style.display = "flex";
        return div;
    }

    update_button_panel(): void {
        this.button_panel.update({
            channel_selected: this.channel_selected(),
            topic_selected: this.topic_selected(),
        });
    }

    get_channel_id(): number | undefined {
        return this.get_channel_list().get_channel_id();
    }

    get_channel_row(): ChannelRow {
        return this.get_channel_list().get_channel_row()!;
    }

    get_channel_name(): string | undefined {
        const channel_row = this.get_channel_row();

        return channel_row?.name();
    }

    get_topic_id(): number | undefined {
        return this.get_topic_list()?.get_topic_id();
    }

    unread_count(): number {
        const topic_row = this.get_topic_row();

        if (topic_row) {
            return topic_row.unread_count();
        }

        const channel_row = this.get_channel_row();

        if (channel_row) {
            return channel_row.unread_count();
        }

        return this.get_channel_list().unread_count();
    }

    get_narrow_label(): string {
        const channel_name = this.get_channel_name();
        const topic_name = this.get_topic_name();
        const unread_count = this.unread_count();

        return narrow_label(channel_name, topic_name, unread_count);
    }

    update_label(): void {
        this.plugin_helper!.update_label(this.get_narrow_label());
    }

    clear_channel(): void {
        this.get_channel_list().clear_selection();
        this.pane_manager.remove_after("channel_pane");
        this.channel_view = undefined;
        this.update_button_panel();
        this.button_panel.focus_next_channel_button();
        this.update_label();
        StatusBar.inform("You can choose a channel now.");
    }

    update_channel(): void {
        const search_widget = this;
        const pane_manager = this.pane_manager;
        const channel_row = this.get_channel_row();

        this.pane_manager.remove_after("channel_pane");

        // ChannelView will add panes
        this.channel_view = new ChannelView(
            channel_row,
            search_widget,
            pane_manager,
        );

        this.update_button_panel();
        StatusBar.inform("You can click on a topic now.");
        this.update_label();
    }

    set_channel_index(index: number): void {
        this.get_channel_list().select_index(index);
        this.update_channel();
        this.button_panel.focus_surf_topics_button();
    }

    channel_up(): void {
        this.get_channel_list().up();
        this.update_channel();
    }

    channel_down(): void {
        this.get_channel_list().down();
        this.update_channel();
    }

    surf_channels(): void {
        const topic_list = this.get_topic_list();

        if (topic_list) {
            topic_list.clear_selection();
        }
        this.get_channel_list().surf();
        this.channel_pane.populate();
        this.update_channel();
        this.button_panel.focus_next_channel_button();
    }

    add_topic(): void {
        if (!this.channel_view) {
            console.log("Add topic without a channel?");
            return;
        }
        this.channel_view.add_topic();
    }

    mark_topic_read(): void {
        const message_list = this.get_message_list();

        if (!message_list) {
            console.log("unexpected lack of message_list");
            return;
        }
        message_list.mark_topic_read();
    }

    update_topic(): void {
        StatusBar.inform("You can read or reply now.");
        this.update_button_panel();
        this.update_label();
    }

    surf_topics(): void {
        this.channel_view!.surf_topics();
        this.update_topic();
        this.button_panel.focus_next_topic_button();
    }

    set_topic_index(index: number): void {
        this.channel_view!.set_topic_index(index);
        this.update_topic();
    }

    topic_up(): void {
        this.channel_view!.topic_up();
        this.update_topic();
    }

    topic_down(): void {
        this.channel_view!.topic_down();
        this.update_topic();
    }

    clear_message_view(): void {
        this.channel_view!.clear_message_view();
        this.update_button_panel();
        this.update_label();
        this.button_panel.focus_surf_topics_button();
    }

    get_message_view(): MessageView | undefined {
        if (this.channel_view) {
            return this.channel_view.get_message_view();
        }

        return undefined;
    }

    reply(): void {
        const message_view = this.get_message_view();
        if (message_view) {
            message_view.reply();
        }
    }

    close(): void {
        this.plugin_helper!.delete_me();
    }

    handle_event(event: ZulipEvent): void {
        if (event.flavor === EventFlavor.MESSAGE) {
            this.handle_incoming_message(event.message);
        }

        if (event.flavor === EventFlavor.MUTATE_MESSAGE) {
            this.refresh_message_ids([event.message_id]);
        }

        if (event.flavor === EventFlavor.MUTATE_UNREAD) {
            this.refresh_message_ids(event.message_ids);
        }

        this.update_label();
    }
}
