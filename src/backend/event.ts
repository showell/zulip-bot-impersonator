import type { Message } from "./db_types";

import { DB } from "./database";

export const enum EventFlavor {
    MESSAGE,
    MUTATE_UNREAD,
    UNKNOWN,
}

type MessageEvent = {
    flavor: EventFlavor.MESSAGE;
    message: Message;
    info: string;
};

type MutateUnreadEvent = {
    flavor: EventFlavor.MUTATE_UNREAD;
    message_ids: number[];
    unread: boolean;
};

type UnknownEvent = {
    flavor: EventFlavor.UNKNOWN;
    raw_event: any;
};

export type ZulipEvent = MessageEvent | MutateUnreadEvent | UnknownEvent;

function build_event(raw_event: any): ZulipEvent | undefined {
    console.log(JSON.stringify(raw_event, null, 4));

    switch (raw_event.type) {
        case "message": {
            const raw_message: any = raw_event.message;

            if (raw_message.type === "stream") {
                const topic = DB.topic_map.get_or_make_topic_for(
                    raw_message.stream_id,
                    raw_message.subject,
                );

                const unread =
                    raw_event.flags.find((flag: string) => flag === "read") ===
                    undefined;

                const message: Message = {
                    id: raw_message.id,
                    type: "stream",
                    sender_id: raw_message.sender_id,
                    stream_id: raw_message.stream_id,
                    topic_id: topic.topic_id,
                    content: raw_message.content,
                    unread,
                    is_super_new: true,
                };
                return {
                    flavor: EventFlavor.MESSAGE,
                    message,
                    info: `stream message id ${message.id}`,
                };
            }

            return undefined;
        }

        case "update_message_flags": {
            if (raw_event.flag === "read") {
                return {
                    flavor: EventFlavor.MUTATE_UNREAD,
                    message_ids: raw_event.messages,
                    unread: raw_event.op === "remove",
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
