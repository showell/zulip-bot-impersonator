import type { Message, Topic, User } from "./db_types.ts";

import { UserMap } from "./model";

// TODO: make class
export type TopicRow = {
    msg_count: number;
    last_msg_id: number;
    unread_count: number;
    topic: Topic;
};

export class MessageRow {
    _message: Message;

    constructor(message: Message) {
        this._message = message;
    }

    sender_name(): string {
        const message = this._message;

        const user = UserMap.get(message.sender_id)
        if (user) {
            return user.full_name;
        } else {
            // TODO: system bots
            return "unknown";
        }
    }

    content(): string {
        return this._message.content;
    }

    unread(): boolean {
        return this._message.unread;
    }

    is_super_new(): boolean {
        return this._message.is_super_new;
    }
}
