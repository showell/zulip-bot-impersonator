import type { StreamMessage } from "./db_types";
import type { Filter } from "./filter";

export class MessageStore {
    raw_stream_messages: StreamMessage[];

    constructor(raw_stream_messages: StreamMessage[]) {
        console.log("building message store");
        this.raw_stream_messages = raw_stream_messages;
    }

    filtered_messages(filter: Filter) {
        const messages = this.raw_stream_messages;

        console.log("using filter", filter.label);
        return messages.filter(filter.predicate);
    }

    messages_for_stream(stream_id: number): StreamMessage[] {
        return this.raw_stream_messages.filter((raw_stream_message) => {
            return raw_stream_message.stream_id === stream_id;
        });
    }

    num_messages_for_stream_id(stream_id: number): number {
        return this.messages_for_stream(stream_id).length;
    }

    add_messages(messages: StreamMessage[]) {
        this.raw_stream_messages.push(...messages);
    }
}
