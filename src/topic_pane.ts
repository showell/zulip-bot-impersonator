import type { Stream } from "./db_types";

import { render_list_heading, render_pane } from "./render";
import { TopicList } from "./topic_list";

type CallbackType = {
    clear_message_view(): void;
    set_topic_index(index: number): void;
};

export class TopicPane {
    div: HTMLElement;
    topic_list: TopicList;

    constructor(stream: Stream, callbacks: CallbackType) {
        const div = render_pane();

        const stream_id = stream.stream_id;

        this.topic_list = new TopicList(stream_id, callbacks);
        this.topic_list.populate();

        div.innerHTML = "";
        div.append(render_list_heading(stream.name));
        div.append(this.topic_list.div);

        this.div = div;
    }

    topic_selected(): boolean {
        if (this.topic_list === undefined) {
            return false;
        }
        return this.topic_list.has_selection();
    }

    get_topic_list(): TopicList {
        return this.topic_list;
    }
}
