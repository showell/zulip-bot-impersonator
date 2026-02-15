import type { RawStreamMessage, RawUser, Stream } from "./db_types";
import { MessageStore } from "./message_store";
import { TopicStore } from "./topic_store";

import * as zulip_client from "./zulip_client";

const BATCH_SIZE = 5000;

type Backend = {
    user_map: Map<number, RawUser>;
    streams: Stream[];
    message_store: MessageStore;
    topic_store: TopicStore;
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

async function fetch_users(): Promise<RawUser[]> {
    const rows: any[] = await zulip_client.get_users();

    return rows.map((row) => {
        return {
            id: row.user_id,
            full_name: row.full_name,
            avatar_url: row.avatar_url,
        };
    });
}

async function fetch_raw_stream_messages(): Promise<RawStreamMessage[]> {
    const rows = await zulip_client.get_messages(BATCH_SIZE);
    return rows
        .filter((row: any) => row.type === "stream")
        .map((row: any) => {
            return {
                id: row.id,
                type: row.type,
                sender_id: row.sender_id,
                topic_name: row.subject,
                stream_id: row.stream_id,
                content: row.content,
            };
        });
}

export async function fetch_model_data(): Promise<Backend> {
    console.log("starting fetch");
    const users = await fetch_users();

    const user_map = new Map<number, RawUser>();

    for (const user of users) {
        user_map.set(user.id, user);
    }

    console.log("got users");

    const streams = await fetch_streams();
    console.log("got streams");

    const raw_stream_messages = await fetch_raw_stream_messages();
    console.log("got messages");

    const message_store = new MessageStore(raw_stream_messages);
    console.log("we have messages");

    const topic_store = new TopicStore(message_store);
    console.log("we have a model");

    return {
        user_map,
        streams,
        message_store,
        topic_store,
    };
}
