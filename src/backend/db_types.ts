export type StreamType = "stream";

export type StreamMessage = {
    id: number;
    type: "stream";
    sender_id: number;
    stream_id: number;
    topic_name: string;
    content: string;
    unread: boolean;
    is_super_new: boolean;
};

export type Message = StreamMessage;

export type Stream = {
    stream_id: number;
    name: string;
    rendered_description: string;
    stream_weekly_traffic: number;
};

export type User = {
    id: number;
    email: string;
    full_name: string;
};

export class Topic {
    stream_id: number;
    name: string;

    constructor(stream_id: number, name: string) {
        this.stream_id = stream_id;
        this.name = name;
    }

    is_same(other: Topic) {
        return this.stream_id === other.stream_id && this.name === other.name;
    }
}
