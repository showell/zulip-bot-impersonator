import { topic_filter } from "./backend/filter";
import type { TopicRow } from "./row_types";

import { MessageList } from "./message_list";
import { MessageViewHeader } from "./message_view_header";
import { render_pane } from "./render";

export class MessagePane {
    div: HTMLElement;
    message_list: MessageList;

    constructor(topic_row: TopicRow) {
        const div = render_pane();

        div.innerHTML = "";
        div.style.minWidth = "350px";

        const topic_line = new MessageViewHeader(topic_row);
        const message_list = new MessageList(
            topic_filter(topic_row.topic_id()),
        );

        div.append(topic_line.div);
        div.append(message_list.div);

        this.div = div;
        this.message_list = message_list;
    }

    get_message_list(): MessageList {
        return this.message_list;
    }
}
