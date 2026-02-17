import type { Stream } from "./backend/db_types";

import type { SearchWidget } from "./search_widget";

import { render_list_heading, render_pane } from "./render";
import { TopicList } from "./topic_list";

export class TopicPane {
    div: HTMLElement;
    topic_list: TopicList;

    constructor(stream: Stream, search_widget: SearchWidget) {
        const div = render_pane();

        const stream_id = stream.stream_id;

        this.topic_list = new TopicList(stream_id, search_widget);
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
