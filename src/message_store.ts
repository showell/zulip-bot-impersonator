import type { StreamMessage } from "./db_types";
import type { Filter } from "./filter";

export class MessageStore {
    stream_messages: StreamMessage[];

    constructor(stream_messages: StreamMessage[]) {
        console.log("building message store");
        this.stream_messages = stream_messages;
    }

    filtered_messages(filter: Filter) {
        const messages = this.stream_messages;

        console.log("using filter", filter.label);
        return messages.filter(filter.predicate);
    }

    messages_for_stream(stream_id: number): StreamMessage[] {
        return this.stream_messages.filter((stream_message) => {
            return stream_message.stream_id === stream_id;
        });
    }

    num_messages_for_stream_id(stream_id: number): number {
        return this.messages_for_stream(stream_id).length;
    }

    add_messages(messages: StreamMessage[]) {
        this.stream_messages.push(...messages);
    }
}
