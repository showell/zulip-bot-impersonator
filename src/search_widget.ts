import type { ZulipEvent } from "./backend/event";
import type { StreamMessage } from "./backend/db_types";

import { EventFlavor } from "./backend/event";

import type { ChannelList } from "./channel_list";
import type { MessageList } from "./message_list";
import type { MessageView } from "./message_view";
import type { PluginHelper } from "./plugin_helper";
import type { ChannelRow } from "./row_types";
import type { TopicList } from "./topic_list";

import { ButtonPanel } from "./nav_button_panel";
import { ChannelPane } from "./channel_pane";
import { ChannelView } from "./channel_view";
import { StatusBar } from "./status_bar";

export class SearchWidget {
    div: HTMLElement;
    button_panel: ButtonPanel;
    main_section: HTMLElement;
    channel_pane: ChannelPane;
    channel_view?: ChannelView;
    plugin_helper?: PluginHelper;

    constructor() {
        const self = this;

        const div = document.createElement("div");

        this.div = div;

        this.button_panel = new ButtonPanel(self);
        this.channel_pane = new ChannelPane(self);
        this.main_section = this.build_main_section();
        this.show_only_channels();
    }

    refresh_message_ids(message_ids: number[]): void {
        this.channel_pane.populate();
        if (this.channel_view) {
            this.channel_view.refresh_message_ids(message_ids);
        }
    }

    refresh(stream_message: StreamMessage): void {
        this.channel_pane.populate();
        if (this.channel_view) {
            this.channel_view.refresh(stream_message);
        }
    }

    make_channel_view() {
        const self = this;

        const stream_id = this.get_stream_id();
        this.channel_view = new ChannelView(stream_id!, self);
    }

    populate(): void {
        const div = this.div;
        const button_panel = this.button_panel;

        div.innerHTML = "";

        div.append(button_panel.div);

        div.append(this.main_section);
    }

    start(plugin_helper: PluginHelper) {
        this.plugin_helper = plugin_helper;
        plugin_helper.label = "search";
        this.update_button_panel();
        this.button_panel.start();
        StatusBar.inform("Begin finding messages by clicking on a channel.");
        plugin_helper.update_label("Channels");
    }

    get_topic_list(): TopicList | undefined {
        if (this.channel_view === undefined) {
            return undefined;
        }
        return this.channel_view.get_topic_list();
    }

    get_topic_name(): string | undefined {
        const topic_list = this.get_topic_list();

        if (topic_list === undefined) {
            return undefined;
        }

        const topic_row = topic_list.get_topic_row();
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

    show_only_channels(): void {
        const div = this.main_section;

        div.innerHTML = "";

        div.append(this.channel_pane.div);

        this.channel_view = undefined;
    }

    show_channels(): void {
        const div = this.main_section;

        div.innerHTML = "";

        div.append(this.channel_pane.div);
        div.append(this.channel_view!.div);

        StatusBar.inform("You can click on a topic now.");
    }

    hide_channels(): void {
        const div = this.main_section;

        div.innerHTML = "";

        div.append(this.channel_view!.div);
    }

    update_button_panel(): void {
        this.button_panel.update({
            channel_selected: this.channel_selected(),
            topic_selected: this.topic_selected(),
        });
    }

    get_stream_id(): number | undefined {
        return this.get_stream_list().get_stream_id();
    }

    get_channel_row(): ChannelRow {
        return this.get_stream_list().get_channel_row()!;
    }

    get_channel_name(): string | undefined {
        const channel_row = this.get_channel_row();

        return channel_row?.name();
    }

    get_stream_list(): ChannelList {
        return this.channel_pane.get_stream_list();
    }

    update_label(): void {
        const plugin_helper = this.plugin_helper!;
        const channel_name = this.get_channel_name();

        let label = "Channels";

        if (channel_name) {
            label = "#" + channel_name;

            const topic_name = this.get_topic_name();

            if (topic_name !== undefined) {
                label = "> " + topic_name;
            }
        }

        plugin_helper.update_label(label);
    }

    clear_channel(): void {
        this.get_stream_list().clear_selection();
        this.show_only_channels();
        this.update_button_panel();
        this.button_panel.focus_next_channel_button();
        this.update_label();
    }

    update_channel(): void {
        this.make_channel_view();
        this.update_button_panel();
        this.show_channels();
        this.update_label();
    }

    set_channel_index(index: number): void {
        this.get_stream_list().select_index(index);
        this.update_channel();
        this.button_panel.focus_surf_topics_button();
    }

    channel_up(): void {
        this.get_stream_list().up();
        this.update_channel();
    }

    channel_down(): void {
        this.get_stream_list().down();
        this.update_channel();
    }

    surf_channels(): void {
        const topic_list = this.get_topic_list();

        if (topic_list) {
            topic_list.clear_selection();
        }
        this.get_stream_list().surf();
        this.channel_pane.populate();
        this.update_channel();
        this.button_panel.focus_next_channel_button();
    }

    add_topic(): void {
        if (!this.channel_view) {
            console.log("Add topic without a channel?");
            return;
        }
        this.hide_channels();
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
        this.hide_channels();
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
        if (event.flavor === EventFlavor.STREAM_MESSAGE) {
            this.refresh(event.stream_message);
        }

        if (event.flavor === EventFlavor.UNREAD_ADD) {
            this.refresh_message_ids(event.message_ids);
        }

        if (event.flavor === EventFlavor.UNREAD_REMOVE) {
            this.refresh_message_ids(event.message_ids);
        }
        this.update_label();
    }
}
