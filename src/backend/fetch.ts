import type { User, Stream } from "./db_types";

import { config } from "../secrets";

import { MessageStore } from "./message_store";
import * as zulip_client from "./zulip_client";

const BATCH_SIZE = 5000;

type Backend = {
    current_user_id: number;
    user_map: Map<number, User>;
    streams: Stream[];
    message_store: MessageStore;
};

async function fetch_streams(): Promise<Stream[]> {
    const subscriptions = await zulip_client.get_subscriptions();

    const streams: Stream[] = subscriptions.map((subscription: any) => {
        return {
            stream_id: subscription.stream_id,
            rendered_description: subscription.rendered_description,
            stream_weekly_traffic: subscription.stream_weekly_traffic,
            name: subscription.name,
        };
    });

    return streams;
}

async function fetch_users(): Promise<User[]> {
    const rows: any[] = await zulip_client.get_users();

    return rows.map((row) => {
        return {
            id: row.user_id,
            email: row.email,
            full_name: row.full_name,
        };
    });
}

export async function fetch_model_data(): Promise<Backend> {
    const users = await fetch_users();

    const user_map = new Map<number, User>();

    let current_user_id = -1;

    for (const user of users) {
        user_map.set(user.id, user);

        if (user.email === config.user_creds.email) {
            current_user_id = user.id;
        }
    }

    const streams = await fetch_streams();

    const rows = await zulip_client.get_messages(BATCH_SIZE);

    const stream_messages = rows
        .filter((row: any) => row.type === "stream")
        .map((row: any) => {
            const unread =
                row.flags.find((flag: string) => flag === "read") === undefined;
            return {
                id: row.id,
                type: row.type,
                sender_id: row.sender_id,
                topic_name: row.subject,
                stream_id: row.stream_id,
                content: row.content,
                is_super_new: false,
                unread,
            };
        });

   for (const row of rows) {
       if (!user_map.has(row.sender_id)) {
            const id = row.sender_id;
            const email = row.sender_email;
            const full_name = row.sender_full_name;
            const user = { id, email, full_name };
            user_map.set(id, user);
        }
    }

    const message_store = new MessageStore(stream_messages);
    return {
        current_user_id,
        user_map,
        streams,
        message_store,
    };
}
