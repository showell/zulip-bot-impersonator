import type { MessageStore } from "./message_store";
import { TopicStore } from "./topic_store";

import * as backend from "./backend";
import type {
    RawUser,
    Stream,
    StreamInfo,
    RawMessage,
    RawStreamMessage,
} from "./db_types.ts";
import { Topic } from "./db_types";

export let UserMap: Map<number, RawUser>;
export let Streams: Stream[];
let CurrentMessageStore: MessageStore;
let CurrentTopicStore: TopicStore;
let CurrentUserId = -1;

// USERS (mostly just pull directly from UserMap for now)

export function is_me(user_id: number): boolean {
    return user_id === CurrentUserId;
}

// STREAMS
//
export function get_streams(): StreamInfo[] {
    return Streams.map((stream) => {
        return {
            num_messages: num_messages_for_stream(stream),
            stream,
        };
    });
}

export function stream_for(stream_id: number): Stream {
    const stream = Streams.find((stream) => {
        return stream.stream_id === stream_id;
    });

    return stream!;
}

export function stream_name_for(stream_id: number): string {
    return stream_for(stream_id).name;
}

function num_messages_for_stream(stream: Stream): number {
    return CurrentMessageStore.num_messages_for_stream_id(stream.stream_id);
}

// TOPICS

export function get_topics(stream_id: number): Topic[] {
    return CurrentTopicStore.get_topics(stream_id);
}

// MESSAGES
//
export function messages_for_topic(topic: Topic): RawMessage[] {
    return CurrentMessageStore.messages_for_topic_name(
        topic.stream_id,
        topic.name,
    );
}

// MISC
//
export function participants_for_stream(stream_id: number): RawUser[] {
    const map = new Map<number, number>();

    const messages = CurrentMessageStore.messages_for_stream(stream_id);

    for (const message of messages) {
        const sender_id = message.sender_id;
        const count = (map.get(sender_id) ?? 0) + 1;
        map.set(sender_id, count);
    }

    const sender_ids = [...map.keys()];

    sender_ids.sort((s1, s2) => map.get(s2)! - map.get(s1)!);

    // we still need system bots
    return sender_ids
        .map((sender_id) => UserMap.get(sender_id)!)
        .filter((user) => user !== undefined);
}

// FETCHING and EVENT PROCESSING

export function add_stream_messages_to_cache(message: RawStreamMessage) {
    CurrentMessageStore.add_messages([message]);
    CurrentTopicStore = new TopicStore(CurrentMessageStore);
}

export async function fetch_model_data(): Promise<void> {
    const { current_user_id, user_map, streams, message_store, topic_store } =
        await backend.fetch_model_data();

    CurrentUserId = current_user_id;
    UserMap = user_map;
    Streams = streams;
    CurrentMessageStore = message_store;
    CurrentTopicStore = topic_store;
}
