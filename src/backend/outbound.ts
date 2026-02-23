import { config } from "../secrets";

type SendInfo = {
    stream_id: number;
    topic_name: string;
    content: string;
};

export function mark_message_ids_unread(unread_message_ids: number[]): void {
    const body = new URLSearchParams({
        op: "add",
        flag: "read",
        messages: JSON.stringify(unread_message_ids),
    });

    const email = config.user_creds.email;
    const api_key = config.user_creds.api_key;

    const credentials = btoa(`${email}:${api_key}`);
    const api_url = `${config.realm_url}/api/v1/messages/flags`;

    fetch(api_url, {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
    });
    // TODO: actually look at response
}

export function send_message(info: SendInfo): void {
    const body = new URLSearchParams({
        type: "stream",
        to: `${info.stream_id}`,
        topic: info.topic_name,
        content: info.content,
        read_by_sender: "true",
    });

    const email = config.user_creds.email;
    const api_key = config.user_creds.api_key;

    const credentials = btoa(`${email}:${api_key}`);
    const api_url = `${config.realm_url}/api/v1/messages`;

    fetch(api_url, {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
    });
    // TODO: actually look at response
}
