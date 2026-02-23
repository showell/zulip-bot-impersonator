import type { StreamMessage } from "./db_types";

import { DB } from "./database";

export const enum EventFlavor {
    STREAM_MESSAGE,
    MARK_AS_READ,
    MARK_AS_UNREAD,
    UNKNOWN,
}

type StreamMessageEvent = {
    flavor: EventFlavor.STREAM_MESSAGE;
    stream_message: StreamMessage;
    info: string;
};

type UnreadAddEvent = {
    flavor: EventFlavor.MARK_AS_READ;
    message_ids: number[];
};

type UnreadRemoveEvent = {
    flavor: EventFlavor.MARK_AS_UNREAD;
    message_ids: number[];
};

type UnknownEvent = {
    flavor: EventFlavor.UNKNOWN;
    raw_event: any;
};

export type ZulipEvent =
    | StreamMessageEvent
    | UnreadAddEvent
    | UnreadRemoveEvent
    | UnknownEvent;

function build_event(raw_event: any): ZulipEvent | undefined {
    console.log(JSON.stringify(raw_event, null, 4));

    switch (raw_event.type) {
        case "message": {
            const message: any = raw_event.message;

            if (message.type === "stream") {
                const topic = DB.topic_map.get_or_make_topic_for(
                    message.stream_id,
                    message.subject,
                );
                const unread =
                    raw_event.flags.find((flag: string) => flag === "read") ===
                    undefined;
                const stream_message: StreamMessage = {
                    id: message.id,
                    type: "stream",
                    sender_id: message.sender_id,
                    stream_id: message.stream_id,
                    topic_id: topic.topic_id,
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
            if (raw_event.op === "add" && raw_event.flag === "read") {
                return {
                    flavor: EventFlavor.MARK_AS_READ,
                    message_ids: raw_event.messages,
                };
            }

            if (raw_event.op === "remove" && raw_event.flag === "read") {
                return {
                    flavor: EventFlavor.MARK_AS_UNREAD,
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
            if (raw_event.type === "heartbeat") {
                // We may re-visit heartbeats when we want more
                // robustnness for staying connected to the server.
                // Until then, they are just too much noise.
                continue;
            }

            const event = build_event(raw_event) ?? {
                flavor: EventFlavor.UNKNOWN,
                raw_event,
            };

            if (event) {
                this.callback(event);
            }
        }
    }
}
