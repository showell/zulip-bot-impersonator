import type { RawMessage, Topic } from "./db_types";

type Predicate = (raw_message: RawMessage) => boolean;

export type Filter = {
    predicate: Predicate;
    label: string;
}

export function topic_filter(topic: Topic): Filter {
    function predicate(raw_message: RawMessage): boolean {
        if (raw_message.type === "stream") {
            return (
                raw_message.stream_id === topic.stream_id &&
                raw_message.topic_name === topic.name
            );
        } else {
            return false;
        }
    }

    const label = topic.name;

    return { predicate, label };
}

