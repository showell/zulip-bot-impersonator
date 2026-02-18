import type { ZulipEvent } from "./event";
import type {
    User,
    Message,
    Stream,
    StreamMessage,
} from "./db_types";
import type { Filter } from "./filter";
import type { MessageStore } from "./message_store";
import type { TopicRow } from "./row_types";

import { EventFlavor } from "./event";
import * as channel_row_query from "./channel_row_query";
import * as fetch from "./fetch";
import { ChannelRow } from "./row_types";
import * as topic_row_query from "./topic_row_query";

export let UserMap: Map<number, User>;
export let Streams: Stream[];
let CurrentMessageStore: MessageStore;
let CurrentUserId = -1;

// USERS (mostly just pull directly from UserMap for now)

export function is_me(user_id: number): boolean {
    return user_id === CurrentUserId;
}

// STREAMS
//
export function get_channel_rows(): ChannelRow[] {
    return channel_row_query.get_rows(Streams, CurrentMessageStore.stream_messages);
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

// TOPICS

export function get_topic_rows(stream_id: number): TopicRow[] {
    function match(message: Message) {
        return message.stream_id === stream_id;
    }
    const stream_messages = CurrentMessageStore.stream_messages.filter(match);
    return topic_row_query.get_rows(stream_messages);
}

// MESSAGES

export function filtered_messages(filter: Filter) {
    return CurrentMessageStore.filtered_messages(filter);
}

export function mark_message_ids_as_read(message_ids: number[]): void {
    CurrentMessageStore.mark_ids_as_read(message_ids);
}

export function mark_message_ids_as_unread(message_ids: number[]): void {
    CurrentMessageStore.mark_ids_as_unread(message_ids);
}

// MISC
//
export function participants_for_messages(messages: Message[]): User[] {
    const map = new Map<number, number>();

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

// EVENTS

export function handle_event(event: ZulipEvent): void {
    if (event.flavor === EventFlavor.STREAM_MESSAGE) {
        add_stream_messages_to_cache(event.stream_message);
    }

    if (event.flavor === EventFlavor.UNREAD_ADD) {
        mark_message_ids_as_read(event.message_ids);
    }

    if (event.flavor === EventFlavor.UNREAD_REMOVE) {
        mark_message_ids_as_unread(event.message_ids);
    }
}


// FETCHING and EVENT PROCESSING

export function add_stream_messages_to_cache(message: StreamMessage) {
    CurrentMessageStore.add_messages([message]);
}

export async function fetch_model_data(): Promise<void> {
    const { current_user_id, user_map, streams, message_store } =
        await fetch.fetch_model_data();

    CurrentUserId = current_user_id;
    UserMap = user_map;
    Streams = streams;
    CurrentMessageStore = message_store;
}
