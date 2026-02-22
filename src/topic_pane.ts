import type { ChannelRow } from "./row_types";
import type { SearchWidget } from "./search_widget";

import { render_list_heading, render_pane } from "./render";
import { TopicList } from "./topic_list";

export class TopicPane {
    div: HTMLElement;
    topic_list: TopicList;

    constructor(channel_row: ChannelRow, search_widget: SearchWidget) {
        const div = render_pane();

        this.topic_list = new TopicList(channel_row, search_widget);
        this.topic_list.populate();

        div.innerHTML = "";
        div.append(render_list_heading("#" + channel_row.name()));
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
