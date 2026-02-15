type StreamType = "stream";

export type RawStreamMessage = {
    id: number;
    type: StreamType;
    sender_id: number;
    stream_id: number;
    topic_name: string;
    content: string;
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
    full_name: string;
    avatar_url: string;
};

