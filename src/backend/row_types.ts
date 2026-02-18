import type { Message, Stream, Topic } from "./db_types.ts";
import type { ListInfo } from "./message_list.ts";

import { UserMap } from "./model";

export class ChannelRow {
    _channel: Stream;
    _list_info: ListInfo;

    constructor(channel: Stream, list_info: ListInfo) {
        this._channel = channel;
        this._list_info = list_info;
    }

    stream_id(): number {
        return this._channel.stream_id;
    }

    name(): string {
        return this._channel.name;
    }

    num_messages(): number {
        return this._list_info.count;
    }

    last_msg_id(): number {
        return this._list_info.last_msg_id;
    }

    unread_count(): number {
        return this._list_info.unread_count;
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
