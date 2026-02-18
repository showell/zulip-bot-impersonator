import type { StreamMessage } from "./backend/db_types";

import type { ChannelList } from "./channel_list";
import type { MessageList } from "./message_list";
import type { TopicList } from "./topic_list";

import { ButtonPanel } from "./nav_button_panel";
import { StreamPane } from "./stream_pane";
import { ChannelView } from "./channel_view";

export class SearchWidget {
    div: HTMLElement;
    button_panel: ButtonPanel;
    main_section: HTMLElement;
    stream_pane: StreamPane;
    channel_view?: ChannelView;
    channels_hidden: boolean;

    constructor() {
        const self = this;

        const div = document.createElement("div");

        this.div = div;

        this.button_panel = new ButtonPanel(self);
        this.stream_pane = new StreamPane(self);
        this.main_section = this.build_main_section();
        this.show_only_channels();

        this.channels_hidden = false;
    }

    refresh_unread(message_ids: number[]): void {
        this.stream_pane.populate();
        if (this.channel_view) {
            this.channel_view.refresh_unread(message_ids);
        }
    }

    refresh(stream_message: StreamMessage): void {
        this.stream_pane.populate();
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

    start() {
        this.update_button_panel();
        this.button_panel.start();
    }

    get_topic_list(): TopicList | undefined {
        if (this.channel_view === undefined) {
            return undefined;
        }
        return this.channel_view.get_topic_list();
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

    stream_selected(): boolean {
        return this.stream_pane.stream_selected();
    }

    build_main_section(): HTMLElement {
        const div = document.createElement("div");
        div.style.display = "flex";
        return div;
    }

    show_only_channels(): void {
        const div = this.main_section;

        div.innerHTML = "";

        div.append(this.stream_pane.div);

        this.channel_view = undefined;
        this.channels_hidden = false;
    }

    show_channels(): void {
        const div = this.main_section;

        div.innerHTML = "";

        div.append(this.stream_pane.div);
        div.append(this.channel_view!.div);

        this.channels_hidden = false;
    }

    hide_channels(): void {
        const div = this.main_section;

        div.innerHTML = "";

        div.append(this.channel_view!.div);

        this.channels_hidden = true;
    }

    update_button_panel(): void {
        this.button_panel.update({
            stream_selected: this.stream_selected(),
            topic_selected: this.topic_selected(),
            channels_hidden: this.channels_hidden,
        });
    }

    get_stream_id(): number | undefined {
        return this.get_stream_list().get_stream_id();
    }

    get_stream_list(): ChannelList {
        return this.stream_pane.get_stream_list();
    }

    set_stream_index(index: number): void {
        this.get_stream_list().select_index(index);
        this.make_channel_view();
        this.update_button_panel();
        this.show_channels();
        this.button_panel.focus_surf_topics_button();
    }

    clear_stream(): void {
        this.get_stream_list().clear_selection();
        this.show_only_channels();
        this.update_button_panel();
        this.button_panel.focus_next_channel_button();
    }

    stream_up(): void {
        this.get_stream_list().up();
        this.make_channel_view();
        this.show_channels();
        this.update_button_panel();
    }

    stream_down(): void {
        this.get_stream_list().down();
        this.make_channel_view();
        this.show_channels();
        this.update_button_panel();
    }

    clear_message_view(): void {
        this.channel_view!.clear_message_view();
        this.update_button_panel();
        this.button_panel.focus_surf_topics_button();
    }

    surf_channels(): void {
        const topic_list = this.get_topic_list();

        if (topic_list) {
            topic_list.clear_selection();
        }
        this.get_stream_list().surf();
        this.stream_pane.populate();
        this.make_channel_view();
        this.show_channels();
        this.update_button_panel();
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

    surf_topics(): void {
        this.channel_view!.surf_topics();
        this.hide_channels();
        this.update_button_panel();
        this.button_panel.focus_next_topic_button();
    }

    set_topic_index(index: number): void {
        this.channel_view!.set_topic_index(index);
        this.hide_channels();
        this.update_button_panel();
        this.button_panel.focus_next_topic_button();
    }

    topic_up(): void {
        this.channel_view!.topic_up();
        this.update_button_panel();
    }

    topic_down(): void {
        this.channel_view!.topic_down();
        this.update_button_panel();
    }
}
