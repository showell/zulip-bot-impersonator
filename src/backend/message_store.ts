import type { StreamMessage } from "./db_types";
import type { Filter } from "./filter";

export class MessageStore {
    stream_messages: StreamMessage[];

    constructor(stream_messages: StreamMessage[]) {
        console.log("building message store");
        this.stream_messages = stream_messages;
    }

    mark_ids_as_read(message_ids: number[]): void {
        const set = new Set(message_ids);
        for (const message of this.stream_messages) {
            if (set.has(message.id)) {
                message.unread = false;
            }
        }
    }

    filtered_messages(filter: Filter) {
        const messages = this.stream_messages;

        console.log("using filter", filter.label);
        return messages.filter(filter.predicate);
    }

    add_messages(messages: StreamMessage[]) {
        this.stream_messages.push(...messages);
    }
}
