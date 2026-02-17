import { StreamMessage, Topic } from "./db_types";
import { TopicRow } from "./row_types";

export function get_rows(stream_messages: StreamMessage[]): TopicRow[] {
    const topic_map = new Map<string, Topic>();
    const message_map = new Map<string, StreamMessage[]>();

    for (const message of stream_messages) {
        const stream_id = message.stream_id;
        const topic_name = message.topic_name;

        let topic: Topic | undefined = topic_map.get(topic_name);

        if (topic === undefined) {
            topic = new Topic(stream_id, topic_name);
            topic_map.set(topic_name, topic);
        }

        let msgs: StreamMessage[] | undefined = message_map.get(topic_name);

        if (msgs === undefined) {
            msgs = [];
            message_map.set(topic_name, msgs);
        }

        msgs.push(message);
    }

    const topic_rows: TopicRow[] = [];

    for (const topic_name of topic_map.keys()) {
        const topic = topic_map.get(topic_name)!;
        const msgs = message_map.get(topic_name)!;
        msgs.sort((m1, m2) => m2.id - m1.id);
        const last_msg_id = msgs[0].id;
        const msg_count = msgs.length;
        const unread_count = msgs.filter((msg) => msg.unread).length;

        const topic_row = { last_msg_id, msg_count, unread_count, topic };

        topic_rows.push(topic_row);
    }

    return topic_rows;
}
