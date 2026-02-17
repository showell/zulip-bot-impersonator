import type { Message, Stream } from "./db_types";

import { MessageList } from "./message_list";
import { ChannelRow } from "./row_types";

export function get_rows(streams: Stream[], messages: Message[]): ChannelRow[] {
    const message_list_map = new Map<number, MessageList>();

    for (const message of messages) {
        if (message.type !== "stream") {
            continue;
        }

        const stream_id = message.stream_id;

        const message_list = message_list_map.get(stream_id) ?? new MessageList();

        message_list.push(message);
        message_list_map.set(stream_id, message_list);
    }

    const rows: ChannelRow[] = [];

    for (const stream of streams) {
        const stream_id = stream.stream_id;
        const message_list = message_list_map.get(stream_id) ?? new MessageList();

        const list_info = message_list.list_info();

        const channel_row = new ChannelRow(stream, list_info.count);

        rows.push(channel_row);
    }

    return rows;
}
