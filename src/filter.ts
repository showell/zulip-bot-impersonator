import type { Message, Stream, Topic } from "./db_types";

type Predicate = (message: Message) => boolean;

export type Filter = {
    predicate: Predicate;
    label: string;
};

export function topic_filter(topic: Topic): Filter {
    function predicate(message: Message): boolean {
        if (message.type === "stream") {
            return (
                message.stream_id === topic.stream_id &&
                message.topic_name === topic.name
            );
        } else {
            return false;
        }
    }

    const label = topic.name;

    return { predicate, label };
}

export function stream_filter(stream: Stream): Filter {
    function predicate(message: Message): boolean {
        if (message.type === "stream") {
            return message.stream_id === stream.stream_id;
        } else {
            return false;
        }
    }

    const label = stream.name;

    return { predicate, label };
}
