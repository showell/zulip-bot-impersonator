import type { Stream, StreamMessage } from "./backend/db_types";
import type { TopicRow } from "./backend/row_types";
import type { SearchWidget } from "./search_widget";

import * as model from "./backend/model";

import type { MessageList } from "./message_list";

import { AddTopicPane } from "./add_topic_pane";
import { ChannelInfo } from "./channel_info";
import { MessageView } from "./message_view";
import { TopicList } from "./topic_list";
import { TopicPane } from "./topic_pane";

export class ChannelView {
    div: HTMLElement;
    stream_id: number;
    stream: Stream;
    channel_info: ChannelInfo;
    topic_pane: TopicPane;
    message_view?: MessageView;

    constructor(stream_id: number, search_widget: SearchWidget) {
        const stream = model.stream_for(stream_id);

        this.stream = stream;
        this.stream_id = stream_id;
        this.channel_info = new ChannelInfo(stream_id);

        this.topic_pane = new TopicPane(stream, search_widget);

        const div = document.createElement("div");
        div.style.display = "flex";

        div.append(this.topic_pane.div);
        div.append(this.channel_info.div);

        this.div = div;
    }

    topic_selected(): boolean {
        return this.topic_pane.topic_selected();
    }

    open_message_view_for_topic(topic_row: TopicRow): void {
        const div = this.div;

        const message_view = new MessageView(topic_row);

        div.innerHTML = "";
        div.append(this.topic_pane.div);
        div.append(message_view.div);

        this.message_view = message_view;
    }

    open_message_view(): void {
        const topic_row = this.get_topic_row()!;
        this.open_message_view_for_topic(topic_row);
    }

    get_topic_list(): TopicList {
        return this.topic_pane.get_topic_list();
    }

    get_topic_row(): TopicRow | undefined {
        const topic_list = this.get_topic_list();
        return topic_list.get_topic_row()!;
    }

    refresh_message_ids(message_ids: number[]): void {
        this.get_topic_list().refresh();

        const message_list = this.get_message_list();

        if (message_list) {
            message_list.refresh_message_ids(message_ids);
        }
    }

    refresh(stream_message: StreamMessage): void {
        if (stream_message.stream_id !== this.stream_id) {
            return;
        }

        const topic_list = this.get_topic_list();
        const topic = topic_list.get_current_topic();
        const sent_by_me = model.is_me(stream_message.sender_id);

        if (!topic) {
            if (sent_by_me) {
                this.select_topic_and_append(stream_message);
            } else {
                topic_list.refresh(); // for counts
            }
        } else {
            if (topic.name === stream_message.topic_name) {
                topic_list.refresh(); // for counts

                if (this.message_view) {
                    this.get_message_list()!.append_message(stream_message);
                }
            } else if (sent_by_me) {
                this.select_topic_and_append(stream_message);
            } else {
                topic_list.refresh();
            }
        }
    }

    get_message_view(): MessageView | undefined {
        return this.message_view;
    }

    get_message_list(): MessageList | undefined {
        if (this.message_view === undefined) {
            return undefined;
        }
        return this.message_view.get_message_list();
    }

    select_topic_and_append(stream_message: StreamMessage): void {
        const topic_list = this.get_topic_list();

        topic_list.refresh_topics_with_topic_name_selected(
            stream_message.topic_name,
        );
        this.open_message_view();
    }

    clear_message_view(): void {
        const div = this.div;
        const topic_list = this.get_topic_list();

        topic_list.clear_selection();

        div.innerHTML = "";
        div.append(this.topic_pane.div);
        div.append(this.channel_info.div);
    }

    add_topic(): void {
        const div = this.div;
        const topic_list = this.get_topic_list();

        topic_list.clear_selection();
        div.innerHTML = "";

        // we want the topic pane to stay visible!
        div.append(this.topic_pane.div);

        // but we replace all other views with our dedicated UI
        // for adding a topic
        const add_topic_pane = new AddTopicPane(this.stream);
        div.append(add_topic_pane.div);

        add_topic_pane.focus_compose_box();
    }

    set_topic_index(index: number): void {
        const topic_list = this.get_topic_list();

        topic_list.select_index(index);
        this.open_message_view();
    }

    surf_topics(): void {
        const topic_list = this.get_topic_list();

        topic_list.surf();
        this.open_message_view();
    }

    topic_up(): void {
        const topic_list = this.get_topic_list();

        topic_list.up();
        this.open_message_view();
    }

    topic_down(): void {
        const topic_list = this.get_topic_list();

        topic_list.down();
        this.open_message_view();
    }
}
