import type { SearchWidget } from "./search_widget";

import { ChannelList } from "./channel_list";
import * as layout from "./layout";

export class ChannelPane {
    div: HTMLDivElement;
    channel_list: ChannelList;

    constructor(search_widget: SearchWidget) {
        const div = document.createElement("div");

        const channel_list = new ChannelList(search_widget);
        channel_list.populate();

        layout.draw_table_pane(div, "Channels", channel_list.div);

        this.channel_list = channel_list;
        this.div = div;
    }

    channel_selected(): boolean {
        return this.channel_list.has_selection();
    }

    get_channel_list(): ChannelList {
        return this.channel_list;
    }

    populate() {
        const channel_list = this.channel_list;

        channel_list.populate();
    }
}
