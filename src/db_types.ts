type StreamType = "stream";

export type RawStreamMessage = {
    id: number;
    type: StreamType;
    sender_id: number;
    stream_id: number;
    topic_name: string;
    content: string;
    unread: boolean;
    is_super_new: boolean;
};

export type RawMessage = RawStreamMessage;

export type StreamInfo = {
    num_messages: number;
    stream: Stream;
};

export type Stream = {
    stream_id: number;
    name: string;
    rendered_description: string;
    stream_weekly_traffic: number;
};

export type RawUser = {
    id: number;
    email: string;
    full_name: string;
    avatar_url: string;
};

export class Topic {
    stream_id: number;
    name: string;
    last_msg_id: number;
    msg_count: number;
    unread_count: number;

    constructor(stream_id: number, name: string) {
        this.stream_id = stream_id;
        this.name = name;
        this.msg_count = 0;
        this.last_msg_id = -1;
        this.unread_count = 0;
    }

    is_same(other: Topic) {
        return this.stream_id === other.stream_id && this.name === other.name;
    }

    update_last_message(msg_id: number): void {
        if (msg_id > this.last_msg_id) {
            this.last_msg_id = msg_id;
        }
        this.msg_count += 1;
    }

    update_unread(unread: boolean): void {
        // any call to this makes the topic unread
        if (unread) {
            this.unread_count += 1;
        }
    }
}
