import type { MessageStore } from "./message_store";
import { Topic } from "./db_types";

export class TopicStore {
    map: Map<string, Topic>;

    constructor(message_store: MessageStore) {
        this.map = new Map<string, Topic>();

        for (const message of message_store.raw_stream_messages) {
            const stream_id = message.stream_id;
            const topic_name = message.topic_name;
            const msg_id = message.id;
            const unread = message.unread;

            const topic = this.get_or_create(stream_id, topic_name);

            topic.update_last_message(msg_id);
            topic.update_unread(unread);
        }
    }

    get_or_create(stream_id: number, topic_name: string): Topic {
        const map = this.map;
        const topic_key = `${stream_id},${topic_name}`;
        const topic = map.get(topic_key);

        if (topic !== undefined) return topic;

        const new_topic = new Topic(stream_id, topic_name);
        map.set(topic_key, new_topic);

        return new_topic;
    }

    get_topics(stream_id: number) {
        const all_topics = [...this.map.values()];

        return all_topics.filter((topic) => topic.stream_id === stream_id);
    }
}
