import type {
    User,
    Message,
    Stream,
} from "./db_types";
import type { Filter } from "./filter";
import type { ChannelRow, TopicRow } from "../row_types";

import { DB } from "./database";
import * as channel_row_query from "./channel_row_query";
import * as topic_row_query from "./topic_row_query";

// USERS (mostly just pull directly from DB.user_map for now)

export function is_me(user_id: number): boolean {
    return user_id === DB.current_user_id;
}

// STREAMS
//
export function get_channel_rows(): ChannelRow[] {
    return channel_row_query.get_rows(DB.channel_map, DB.message_store.stream_messages);
}

export function stream_for(stream_id: number): Stream {
    return DB.channel_map.get(stream_id)!;
}

export function stream_name_for(stream_id: number): string {
    return stream_for(stream_id).name;
}

// TOPICS

export function get_topic_rows(stream_id: number): TopicRow[] {
    function match(message: Message) {
        return message.stream_id === stream_id;
    }
    const stream_messages = DB.message_store.stream_messages.filter(match);
    return topic_row_query.get_rows(stream_messages);
}

// MESSAGES

export function filtered_messages(filter: Filter) {
    return DB.message_store.stream_messages.filter(filter.predicate);
}

export function get_total_unread_count() {
    let count = 0;
    for (const message of DB.message_store.stream_messages) {
        if (message.unread) {
            ++count;
        }
    }
    return count;
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
        .map((sender_id) => DB.user_map.get(sender_id)!)
        .filter((user) => user !== undefined);
}

