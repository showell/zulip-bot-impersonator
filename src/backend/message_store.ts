import type { Message } from "./db_types";

export class MessageStore {
    messages: Message[];

    constructor(messages: Message[]) {
        this.messages = messages;
    }

    mark_ids_as_read(message_ids: number[]): void {
        const set = new Set(message_ids);
        for (const message of this.messages) {
            if (set.has(message.id)) {
                message.unread = false;
            }
        }
    }

    mark_ids_as_unread(message_ids: number[]): void {
        const set = new Set(message_ids);
        for (const message of this.messages) {
            if (set.has(message.id)) {
                message.unread = true;
            }
        }
    }

    add_messages(messages: Message[]) {
        this.messages.push(...messages);
    }
}
