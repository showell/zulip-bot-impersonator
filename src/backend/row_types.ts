import type { Message, Stream, Topic } from "./db_types.ts";

import { UserMap } from "./model";

export class ChannelRow {
    _channel: Stream;
    _num_messages: number;

    constructor(channel: Stream, num_messages: number) {
        this._channel = channel;
        this._num_messages = num_messages;
    }

    stream_id(): number {
        return this._channel.stream_id;
    }

    name(): string {
        return this._channel.name;
    }

    num_messages(): number {
        return this._num_messages;
    }
}

export type TopicRow = {
    // TODO: make class
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
