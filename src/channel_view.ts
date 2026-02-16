import type { StreamMessage, Topic } from "./db_types";

import { AddTopicPane } from "./add_topic_pane";
import { ChannelInfo } from "./channel_info";
import { MessageView } from "./message_view";
import * as model from "./model";
import { TopicList } from "./topic_list";
import { TopicPane } from "./topic_pane";

type CallbackType = {
    clear_message_view(): void;
    set_topic_index(index: number): void;
};

export class ChannelView {
    div: HTMLElement;
    stream_id: number;
    channel_info: ChannelInfo;
    topic_pane: TopicPane;
    message_view?: MessageView;

    constructor(stream_id: number, callbacks: CallbackType) {
        this.stream_id = stream_id;

        this.channel_info = new ChannelInfo(stream_id);

        this.topic_pane = new TopicPane(stream_id, {
            clear_message_view(): void {
                callbacks.clear_message_view();
            },
            set_topic_index(index: number): void {
                callbacks.set_topic_index(index);
            },
        });

        const div = document.createElement("div");
        div.style.display = "flex";

        div.append(this.topic_pane.div);
        div.append(this.channel_info.div);

        this.div = div;
    }

    topic_selected(): boolean {
        return this.topic_pane.topic_selected();
    }

    open_message_view_for_topic(topic: Topic): void {
        const div = this.div;

        const message_view = new MessageView(topic!);

        div.innerHTML = "";
        div.append(this.topic_pane.div);
        div.append(message_view.div);

        this.message_view = message_view;
    }

    open_message_view(): void {
        const topic_list = this.get_topic_list();
        const topic = topic_list.get_current_topic()!;

        this.open_message_view_for_topic(topic);
    }

    get_topic_list(): TopicList {
        return this.topic_pane.get_topic_list();
    }

    refresh(raw_stream_message: StreamMessage): void {
        if (raw_stream_message.stream_id !== this.stream_id) {
            return;
        }

        const topic_list = this.get_topic_list();
        const topic = topic_list.get_current_topic();
        const sent_by_me = model.is_me(raw_stream_message.sender_id);

        if (!topic) {
            if (sent_by_me) {
                this.select_topic_and_append(raw_stream_message);
            } else {
                topic_list.refresh(); // for counts
            }
        } else {
            if (topic.name === raw_stream_message.topic_name) {
                topic_list.refresh(); // for counts

                if (this.message_view) {
                    this.message_view.append_message(raw_stream_message);
                }
            } else if (sent_by_me) {
                this.select_topic_and_append(raw_stream_message);
            } else {
                topic_list.refresh();
            }
        }
    }

    select_topic_and_append(raw_stream_message: StreamMessage): void {
        const topic_list = this.get_topic_list();

        topic_list.refresh_topics_with_topic_name_selected(
            raw_stream_message.topic_name,
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
        const add_topic_pane = new AddTopicPane(this.stream_id);
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
