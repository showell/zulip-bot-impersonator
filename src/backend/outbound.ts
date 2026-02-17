import { config } from "../secrets";

type SendInfo = {
    stream_id: number;
    topic_name: string;
    content: string;
};

export async function send_message(info: SendInfo): Promise<void> {
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

    const response = await fetch(api_url, {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
    });

    const data = await response.json();
    console.log(data);
}

