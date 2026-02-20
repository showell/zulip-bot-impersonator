import type { Message } from "./db_types";

import { Topic } from "./db_types";
import { MessageList } from "./message_list";
import { TopicRow } from "../row_types";

export function get_rows(messages: Message[]): TopicRow[] {
    const topic_map = new Map<string, Topic>();
    const message_list_map = new Map<string, MessageList>();

    for (const message of messages) {
        const stream_id = message.stream_id;
        const topic_name = message.topic_name;

        const topic = topic_map.get(topic_name) ?? new Topic(stream_id, topic_name);
        topic_map.set(topic_name, topic);

        const message_list = message_list_map.get(topic_name) ?? new MessageList();

        message_list.push(message);
        message_list_map.set(topic_name, message_list);
    }

    const topic_rows: TopicRow[] = [];

    for (const topic_name of topic_map.keys()) {
        const topic = topic_map.get(topic_name)!;
        const message_list = message_list_map.get(topic_name)!;
        const list_info = message_list.list_info();

        const topic_row = new TopicRow(topic, list_info);

        topic_rows.push(topic_row);
    }

    return topic_rows;
}
