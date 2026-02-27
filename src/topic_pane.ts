import type { ChannelRow } from "./row_types";
import type { SearchWidget } from "./search_widget";

import * as layout from "./layout";
import { render_pane } from "./render";
import { TopicList } from "./topic_list";

export class TopicPane {
    div: HTMLElement;
    topic_list: TopicList;

    constructor(channel_row: ChannelRow, search_widget: SearchWidget) {
        const div = render_pane();

        const topic_list = new TopicList(channel_row, search_widget);
        topic_list.populate();

        const heading_text = "#" + channel_row.name();

        layout.draw_table_pane(
            div,
            heading_text,
            topic_list.div,
        );

        this.topic_list = topic_list;
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
