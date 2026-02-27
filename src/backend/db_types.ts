export type StreamType = "stream";

export type Message = {
    id: number;
    type: "stream";
    sender_id: number;
    stream_id: number;
    topic_id: number;
    content: string;
    unread: boolean;
    is_super_new: boolean;
    code_snippets: string[];
};

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

export type Topic = {
    topic_id: number;
    channel_id: number;
    topic_name: string;
};
