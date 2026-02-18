import type { SearchWidget } from "./search_widget";

import { ChannelList } from "./channel_list";

import { render_list_heading, render_pane } from "./render";

export class StreamPane {
    div: HTMLElement;
    channel_list: ChannelList;

    constructor(search_widget: SearchWidget) {
        const div = render_pane();

        this.channel_list = new ChannelList(search_widget);

        this.div = div;
        this.populate();
    }

    channel_selected(): boolean {
        return this.channel_list.has_selection();
    }

    get_stream_list(): ChannelList {
        return this.channel_list;
    }

    populate() {
        const div = this.div;
        const channel_list = this.channel_list;

        channel_list.populate();

        div.innerHTML = "";
        div.append(render_list_heading("Channels"));
        div.append(channel_list.div);
    }
}
