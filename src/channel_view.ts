import type { StreamMessage } from "./backend/db_types";
import type { TopicRow } from "./row_types";
import type { SearchWidget } from "./search_widget";

import * as model from "./backend/model";

import type { MessageList } from "./message_list";

import { AddTopicPane } from "./add_topic_pane";
import { ChannelInfo } from "./channel_info";
import { MessageView } from "./message_view";
import { PaneManager } from "./pane_manager";
import { ChannelRow } from "./row_types";
import { TopicList } from "./topic_list";
import { TopicPane } from "./topic_pane";

export class ChannelView {
    channel_row: ChannelRow;
    channel_info: ChannelInfo;
    topic_pane: TopicPane;
    message_view?: MessageView;
    add_topic_pane?: AddTopicPane;
    pane_manager: PaneManager;

    constructor(
        channel_row: ChannelRow,
        search_widget: SearchWidget,
        pane_manager: PaneManager,
    ) {
        this.channel_row = channel_row;
        this.pane_manager = pane_manager;

        this.add_topic_pane = undefined;

        this.topic_pane = new TopicPane(channel_row, search_widget);
        pane_manager.add_pane({
            key: "topic_pane",
            pane_widget: this.topic_pane,
        });

        this.channel_info = new ChannelInfo(channel_row);
        pane_manager.add_pane({
            key: "channel_info",
            pane_widget: this.channel_info,
        });
    }

    topic_selected(): boolean {
        return this.topic_pane.topic_selected();
    }

    open_message_view(): void {
        const pane_manager = this.pane_manager;
        const topic_row = this.get_topic_row()!;

        pane_manager.remove_after("topic_pane");

        const message_view = new MessageView(topic_row, pane_manager);

        if (this.add_topic_pane) {
            pane_manager.add_pane({
                key: "add_topic_pane",
                pane_widget: this.add_topic_pane,
            });
        }

        this.message_view = message_view;
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
        if (stream_message.stream_id !== this.channel_row.stream_id()) {
            return;
        }

        const topic_list = this.get_topic_list();
        const topic_row = topic_list.get_topic_row();
        const sent_by_me = model.is_me(stream_message.sender_id);

        /*
         * In the add-topic scenario, we don't switch to the
         * new topic until the message event gets confirmed
         * by the server. If the server lags a bit, we risk
         * having the user intentionally change topic views
         * in between, but this is not the end of the world.
         *
         * We try to guess as best as we can. To be more
         * rigorous, we may eventually try to use queue_id
         * and local_id (see https://zulip.com/api/send-message)
         * to reconcile messages.
         */

        const can_change_topic = sent_by_me && this.add_topic_pane;

        if (!topic_row) {
            if (can_change_topic) {
                this.select_topic_and_append(stream_message);
            } else {
                topic_list.refresh(); // for counts
            }
        } else {
            if (topic_row.name() === stream_message.topic_name) {
                topic_list.refresh(); // for counts

                if (this.message_view) {
                    this.get_message_list()!.append_message(stream_message);
                }
            } else if (can_change_topic) {
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
        const pane_manager = this.pane_manager;
        const topic_list = this.get_topic_list();

        topic_list.clear_selection();

        pane_manager.replace_after("topic_pane", {
            key: "channel_info",
            pane_widget: this.channel_info,
        });

        this.add_topic_pane = undefined;
    }

    add_topic(): void {
        const pane_manager = this.pane_manager;
        const topic_list = this.get_topic_list();

        topic_list.clear_selection();

        const add_topic_pane = new AddTopicPane(this.channel_row);

        pane_manager.replace_after("topic_pane", {
            key: "add_topic_pane",
            pane_widget: add_topic_pane,
        });

        add_topic_pane.focus_compose_box();

        this.add_topic_pane = add_topic_pane;
    }

    set_topic_index(index: number): void {
        const topic_list = this.get_topic_list();

        topic_list.select_index(index);
        this.add_topic_pane = undefined;
        this.open_message_view();
    }

    surf_topics(): void {
        const topic_list = this.get_topic_list();

        topic_list.surf();
        this.add_topic_pane = undefined;
        this.open_message_view();
    }

    topic_up(): void {
        const topic_list = this.get_topic_list();

        topic_list.up();
        this.add_topic_pane = undefined;
        this.open_message_view();
    }

    topic_down(): void {
        const topic_list = this.get_topic_list();

        topic_list.down();
        this.add_topic_pane = undefined;
        this.open_message_view();
    }
}
