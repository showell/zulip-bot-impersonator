import type { StreamMessage } from "./db_types";

export const enum EventFlavor {
    STREAM_MESSAGE,
    UNREAD_ADD,
}

type StreamMessageEvent = {
    flavor: EventFlavor.STREAM_MESSAGE;
    stream_message: StreamMessage;
    info: string;
};

type UnreadAddEvent = {
    flavor: EventFlavor.UNREAD_ADD;
    message_ids: number[];
}

export type ZulipEvent = StreamMessageEvent | UnreadAddEvent;

function build_event(raw_event: any): ZulipEvent | undefined {
    if (raw_event.type !== "heartbeat") {
        console.log(JSON.stringify(raw_event, null, 4));
    }

    switch (raw_event.type) {
        case "message": {
            const message: any = raw_event.message;

            if (message.type === "stream") {
                const unread = true;
                const stream_message: StreamMessage = {
                    id: message.id,
                    type: "stream",
                    sender_id: message.sender_id,
                    stream_id: message.stream_id,
                    topic_name: message.subject,
                    content: message.content,
                    unread,
                    is_super_new: true,
                };
                return {
                    flavor: EventFlavor.STREAM_MESSAGE,
                    stream_message,
                    info: `stream message id ${message.id}`,
                };
            }

            return undefined;
        }

        case "update_message_flags": {
            if (raw_event.op === "add" && raw_event.op === "add" && raw_event.flag === "read") {
                return {
                    flavor: EventFlavor.UNREAD_ADD,
                    message_ids: raw_event.messages,
                };
            }

            return undefined;
        }

    }

    return undefined;
}

type EventCallbackType = (event: ZulipEvent) => void;

export class EventHandler {
    callback: EventCallbackType;

    constructor(callback: EventCallbackType) {
        this.callback = callback;
    }

    process_events(raw_events: any): void {
        for (const raw_event of raw_events) {
            const event = build_event(raw_event);

            if (event) {
                this.callback(event);
            }
        }
    }
}
