import type { RawStreamMessage } from "./db_types";

export class MessageStore {
    raw_stream_messages: RawStreamMessage[];

    constructor(raw_stream_messages: RawStreamMessage[]) {
        console.log("building message store");
        this.raw_stream_messages = raw_stream_messages;
    }

    messages_for_topic_name(stream_id: number, topic_name: string) {
        return this.raw_stream_messages.filter((raw_stream_message) => {
            return (
                raw_stream_message.stream_id === stream_id &&
                raw_stream_message.topic_name === topic_name
            );
        });
    }

    messages_for_stream(stream_id: number): RawStreamMessage[] {
        return this.raw_stream_messages.filter((raw_stream_message) => {
            return raw_stream_message.stream_id === stream_id;
        });
    }

    num_messages_for_stream_id(stream_id: number): number {
        return this.messages_for_stream(stream_id).length;
    }

    add_messages(messages: RawStreamMessage[]) {
        this.raw_stream_messages.push(...messages);
    }
}

