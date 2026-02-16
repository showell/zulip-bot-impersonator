import type { StreamMessage, Topic } from "./db_types";

import { topic_filter } from "./filter";
import { MessageList } from "./message_list";
import { MessageViewHeader } from "./message_view_header";
import { render_pane } from "./render";

export class MessagePane {
    div: HTMLElement;
    message_list: MessageList;

    constructor(topic: Topic) {
        const div = render_pane();

        div.innerHTML = "";
        div.style.minWidth = "350px";

        const topic_line = new MessageViewHeader(topic);
        const message_list = new MessageList(topic_filter(topic));

        div.append(topic_line.div);
        div.append(message_list.div);

        this.div = div;
        this.message_list = message_list;
    }

    append_message(stream_message: StreamMessage) {
        this.message_list.append_message(stream_message);
    }
}
