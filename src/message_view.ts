import type { StreamMessage } from "./backend/db_types";
import type { TopicRow } from "./backend/row_types";

import type { MessageList } from "./message_list";

import { MessagePane } from "./message_pane";
import { ReplyPane } from "./reply_pane";

export class MessageView {
    div: HTMLElement;
    message_pane: MessagePane;

    constructor(topic_row: TopicRow) {
        const div = document.createElement("div");

        div.innerHTML = "";
        div.style.display = "flex";

        const message_pane = new MessagePane(topic_row);
        div.append(message_pane.div);

        const reply_pane = new ReplyPane(topic_row.topic);
        div.append(reply_pane.div);

        this.div = div;
        this.message_pane = message_pane;
    }

    get_message_list(): MessageList {
        return this.message_pane.get_message_list();
    }
}
