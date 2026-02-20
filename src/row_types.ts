import type { Message, Stream, Topic } from "./backend/db_types.ts";
import type { ListInfo } from "./backend/message_list.ts";

import { UserMap } from "./backend/model";

/*
 *  In some ways this code would more logically belong in the
 *  "backend" directory (and that's where it was originally),
 *  but all of these classes are **supposed** to be consumed
 *  by our UI classes, including our plugins.
 */

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

export class TopicRow {
    _topic: Topic;
    _list_info: ListInfo;

    constructor(topic: Topic, list_info: ListInfo) {
        this._topic = topic;
        this._list_info = list_info;
    }

    topic(): Topic {
        return this._topic;
    }

    name(): string {
        return this._topic.name;
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

export class MessageRow {
    _message: Message;

    constructor(message: Message) {
        this._message = message;
    }

    sender_name(): string {
        const message = this._message;

        const user = UserMap.get(message.sender_id);
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
