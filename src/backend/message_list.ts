import { Message } from "./db_types";

type ListInfo = {
    last_msg_id: number;
    count: number;
    unread_count: number;
};

export class MessageList {
    messages: Message[];

    constructor() {
        this.messages = [];
    }

    push(message: Message): void {
        this.messages.push(message)
    }

    list_info(): ListInfo {
        const messages = this.messages;

        if (messages.length === 0) {
            return { last_msg_id: -1, count: 0, unread_count: 0 };
        }

        messages.sort((m1, m2) => m2.id - m1.id);
        const last_msg_id = messages[0].id;
        const count = messages.length;
        const unread_count = messages.filter((msg) => msg.unread).length;

        return { last_msg_id, count, unread_count};
    }
}
