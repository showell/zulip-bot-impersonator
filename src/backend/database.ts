import type { User, Stream } from "./db_types";
import type { MessageStore } from "./message_store";

export type Database = {
    current_user_id: number;
    user_map: Map<number, User>;
    channel_map: Map<number, Stream>;
    message_store: MessageStore;
};

