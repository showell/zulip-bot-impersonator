import * as fs from "fs";
import type { EventHandler } from "./event";

import { realm_data, self_creds } from "../secrets";

function get_headers() {
    const auth = btoa(`${self_creds.email}:${self_creds.api_key}`);
    const auth_header = `Basic ${auth}`;
    return { Authorization: auth_header };
}

let queue_id: string | undefined;
let last_event_id: string | undefined;


export async function fetch_temp_image(image_url: string) {
    const url = new URL(image_url, realm_data.url);

    const response = await fetch(url, {
        method: "GET",
        headers: get_headers(),
    });
    const blob = await response.blob();
    console.log(blob);
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const path = "tmp.png";

    await fs.writeFile(path, buffer, () => {});
}

export async function fetch_image(image_url: string) {
    const url = new URL(image_url);

    const response = await fetch(url, {
        method: "GET",
        headers: get_headers(),
    });
    const data = await response.json();

    const temp_url = data.url
    console.log(temp_url);

    await fetch_temp_image(temp_url);
}

export async function register_queue() {
    const url = new URL("/api/v1/register", realm_data.url);
    url.searchParams.set("apply_markdown", "true");

    const response = await fetch(url, {
        method: "POST",
        headers: get_headers(),
    });
    const data = await response.json();
    queue_id = data.queue_id;
    last_event_id = data.last_event_id;
}

export async function start_polling(event_handler: EventHandler) {
    if (queue_id === undefined || last_event_id === undefined) {
        return;
    }

    const url = new URL("/api/v1/events", realm_data.url);

    while (queue_id !== undefined && last_event_id !== undefined) {
        url.searchParams.set("queue_id", queue_id);
        url.searchParams.set("last_event_id", last_event_id);

        const response = await fetch(url, { headers: get_headers() });
        const data = await response.json();

        if (data.result !== "success") {
            window.location.reload();
        }
        if (data.events?.length) {
            last_event_id = data.events[data.events.length - 1].id;
            event_handler.process_events(data.events);
        }
    }
}

export async function get_messages(num_before: number) {
    const url = new URL(`/api/v1/messages`, realm_data.url);
    url.searchParams.set("narrow", `[]`);
    url.searchParams.set("num_before", JSON.stringify(num_before));
    url.searchParams.set("anchor", "newest");
    const response = await fetch(url, { headers: get_headers() });
    const data = await response.json();
    return data.messages;
}

export async function get_users() {
    const url = new URL(`/api/v1/users`, realm_data.url);
    const response = await fetch(url, { headers: get_headers() });
    const data = await response.json();
    return data.members;
}

export async function get_subscriptions() {
    const url = new URL(`/api/v1/users/me/subscriptions`, realm_data.url);
    const response = await fetch(url, { headers: get_headers() });
    const data = await response.json();
    return data.subscriptions;
}
