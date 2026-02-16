import type { StreamMessage, User, Stream } from "./db_types";

import { config } from "./secrets";
import { MessageStore } from "./message_store";
import * as zulip_client from "./zulip_client";

const BATCH_SIZE = 700;

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
            avatar_url: row.avatar_url,
        };
    });
}

async function fetch_stream_messages(): Promise<StreamMessage[]> {
    const rows = await zulip_client.get_messages(BATCH_SIZE);
    return rows
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
}

export async function fetch_model_data(): Promise<Backend> {
    console.log("starting fetch");
    const users = await fetch_users();

    const user_map = new Map<number, User>();

    let current_user_id = -1;

    for (const user of users) {
        user_map.set(user.id, user);

        if (user.email === config.user_creds.email) {
            console.log("me?", user);
            current_user_id = user.id;
        }
    }

    console.log("got users");

    const streams = await fetch_streams();
    console.log("got streams");

    const stream_messages = await fetch_stream_messages();
    console.log("got messages");

    const message_store = new MessageStore(stream_messages);
    console.log("we have messages");

    console.log("current_user_id", current_user_id);

    return {
        current_user_id,
        user_map,
        streams,
        message_store,
    };
}
