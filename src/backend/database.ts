import type { ZulipEvent } from "./event";
import type { User, Stream, StreamMessage } from "./db_types";
import type { MessageStore } from "./message_store";

import { EventFlavor } from "./event";
import * as fetch from "./fetch";

export let DB: Database;

export type Database = {
    current_user_id: number;
    user_map: Map<number, User>;
    channel_map: Map<number, Stream>;
    message_store: MessageStore;
};

export async function fetch_original_data(): Promise<void> {
    DB = await fetch.fetch_model_data();
}

// EVENTS

export function handle_event(event: ZulipEvent): void {
    if (event.flavor === EventFlavor.STREAM_MESSAGE) {
        add_stream_messages_to_cache(event.stream_message);
    }

    if (event.flavor === EventFlavor.MARK_AS_READ) {
        mark_message_ids_as_read(event.message_ids);
    }

    if (event.flavor === EventFlavor.MARK_AS_UNREAD) {
        mark_message_ids_as_unread(event.message_ids);
    }
}

export function add_stream_messages_to_cache(message: StreamMessage) {
    DB.message_store.add_messages([message]);
}

export function mark_message_ids_as_read(message_ids: number[]): void {
    DB.message_store.mark_ids_as_read(message_ids);
}

export function mark_message_ids_as_unread(message_ids: number[]): void {
    DB.message_store.mark_ids_as_unread(message_ids);
}

