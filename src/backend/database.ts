import type { ZulipEvent } from "./event";
import type { User, Stream, Message } from "./db_types";

import { EventFlavor } from "./event";
import * as fetch from "./fetch";
import { TopicMap } from "./topic_map";

export let DB: Database;

export type Database = {
    current_user_id: number;
    user_map: Map<number, User>;
    channel_map: Map<number, Stream>;
    topic_map: TopicMap;
    message_map: Map<number, Message>;
};

export async function fetch_original_data(): Promise<void> {
    DB = await fetch.fetch_model_data();
}

// EVENTS

export function handle_event(event: ZulipEvent): void {
    if (event.flavor === EventFlavor.MESSAGE) {
        add_message_to_cache(event.message);
    }

    if (event.flavor === EventFlavor.MARK_AS_READ) {
        mark_message_ids_as_read(event.message_ids);
    }

    if (event.flavor === EventFlavor.MARK_AS_UNREAD) {
        mark_message_ids_as_unread(event.message_ids);
    }
}

export function add_message_to_cache(message: Message) {
    DB.message_map.set(message.id, message);
}

export function mutate_messages(
    message_ids: number[],
    mutate: (message: Message) => void,
): void {
    for (const message_id of message_ids) {
        const message = DB.message_map.get(message_id);
        if (message) {
            mutate(message);
        } else {
            console.log("UNKNOWN message id!", message_id);
        }
    }
}

export function mark_message_ids_as_read(message_ids: number[]): void {
    mutate_messages(message_ids, (message) => {
        message.unread = false;
    });
}

export function mark_message_ids_as_unread(message_ids: number[]): void {
    mutate_messages(message_ids, (message) => {
        message.unread = true;
    });
}
