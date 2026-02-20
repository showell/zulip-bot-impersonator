import type { MessageList } from "./message_list";
import type { TopicRow } from "./row_types";

import { ComposeBox } from "./compose";
import { MessagePane } from "./message_pane";
import { ReplyPane } from "./reply_pane";

export class MessageView {
    div: HTMLElement;
    message_pane: MessagePane;
    topic_row: TopicRow;
    reply_pane?: ReplyPane;

    constructor(topic_row: TopicRow) {
        const div = document.createElement("div");

        div.innerHTML = "";
        div.style.display = "flex";

        const message_pane = new MessagePane(topic_row);
        div.append(message_pane.div);

        this.div = div;
        this.topic_row = topic_row;
        this.message_pane = message_pane;
    }

    reply(): void {
        const div = this.div;
        const topic_row = this.topic_row;

        if (!this.reply_pane) {
            const reply_pane = new ReplyPane(topic_row.topic);
            div.append(reply_pane.div);
            this.reply_pane = reply_pane;
        }

        const compose_box: ComposeBox = this.reply_pane.get_compose_box();
        compose_box.focus_textarea();
    }

    get_message_list(): MessageList {
        return this.message_pane.get_message_list();
    }
}
