import type { Message } from "./backend/db_types";
import type { Filter } from "./backend/filter";

import * as model from "./backend/model";
import * as outbound from "./backend/outbound";

import { MessageRow } from "./backend/row_types";

import { MessageRowWidget } from "./message_row_widget";
import { render_spacer } from "./render";
import { SmartList } from "./smart_list";

type MessageInfo = {
    message: Message;
    use_sender: boolean;
};

export class MessageList {
    div: HTMLElement;
    filter: Filter;
    smart_list: SmartList;
    index_map: Map<number, number>;
    rows: MessageInfo[];

    constructor(filter: Filter) {
        const self = this;

        this.filter = filter;

        this.index_map = new Map<number, number>();

        const div = document.createElement("div");
        div.style.maxHeight = "80vh";
        div.style.overflowY = "auto";

        const messages = model.filtered_messages(filter);

        const rows: MessageInfo[] = [];

        let prev_sender_id: number | undefined;

        for (const message of messages) {
            let sender_id: number | undefined = message.sender_id;

            const use_sender = sender_id !== prev_sender_id;

            if (use_sender) {
                prev_sender_id = sender_id;
            }

            rows.push({ message, use_sender });
        }

        const smart_list = new SmartList({
            size: rows.length,
            get_div(index: number) {
                const { message, use_sender } = rows[index];

                // remember our index for updates
                self.index_map.set(message.id, index);

                const message_row = new MessageRow(message);
                const message_row_widget = new MessageRowWidget(
                    message_row,
                    use_sender,
                );
                return message_row_widget.div;
            },
            when_done() {
                self.scroll_to_bottom();
            },
        });

        div.append(smart_list.div);
        div.append(render_spacer());
        div.append(render_spacer());

        this.div = div;
        this.rows = rows;
        this.smart_list = smart_list;
    }

    mark_topic_read() {
        const unread_message_ids = this.rows
            .map((row) => {
                return row.message;
            })
            .filter((message) => message.unread)
            .map((message) => message.id);

        if (unread_message_ids) {
            outbound.mark_message_ids_unread(unread_message_ids);
        }
    }

    refresh_message_ids(message_ids: number[]): void {
        const index_map = this.index_map;

        for (const message_id of message_ids) {
            const index = index_map.get(message_id);

            if (index !== undefined) {
                this.smart_list.replace(index);
            }
        }
    }

    append_message(message: Message) {
        const filter = this.filter;
        const rows = this.rows;

        if (!filter.predicate(message)) {
            return;
        }

        const use_sender = true;

        rows.push({ message, use_sender });
        this.index_map.set(message.id, rows.length - 1);

        const message_row = new MessageRow(message);
        const message_row_widget = new MessageRowWidget(
            message_row,
            use_sender,
        );

        const was_near_bottom = this.near_bottom();

        this.smart_list.append(message_row_widget.div);

        if (was_near_bottom) {
            this.scroll_to_bottom();
        }
    }

    near_bottom(): boolean {
        const div = this.div;
        console.log(div.scrollTop);
        console.log(div.scrollHeight);
        console.log(div.clientHeight);

        return div.scrollTop > div.scrollHeight - div.clientHeight - 10;
    }

    scroll_to_bottom() {
        const div = this.div;

        div.scrollTop = div.scrollHeight - div.clientHeight;
    }
}
