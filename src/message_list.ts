import type { Message } from "./backend/db_types";
import type { Filter } from "./backend/filter";
import * as model from "./backend/model";

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

    constructor(filter: Filter) {
        this.filter = filter;

        const div = document.createElement("div");
        div.style.maxHeight = "80vh";
        div.style.overflowY = "auto";

        this.div = div;

        const smart_list = this.populate();
        this.smart_list = smart_list;

        div.append(smart_list.div);
        div.append(render_spacer());
        div.append(render_spacer());
    }

    refresh_unread(message_ids: number[]): void {
        console.log("made it to message_list", message_ids);
        // this.smart_list.refresh_ids(message_ids);
    }

    append_message(message: Message) {
        const filter = this.filter;

        if (!filter.predicate(message)) {
            return;
        }

        const use_sender = true;

        const message_row = new MessageRow(message);
        const message_row_widget = new MessageRowWidget(message_row, use_sender);

        const was_near_bottom = this.near_bottom();

        this.smart_list.append(message_row_widget.div);

        if (was_near_bottom) {
            this.scroll_to_bottom();
        }
    }

    populate(): SmartList {
        const self = this;
        const div = this.div;
        const filter = this.filter;

        div.innerHTML = "";

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

                const message_row = new MessageRow(message);
                const message_row_widget = new MessageRowWidget(message_row, use_sender);
                return message_row_widget.div;
            },
            when_done() {
                self.scroll_to_bottom();
            },
        });

        return smart_list;
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
