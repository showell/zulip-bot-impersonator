import type { ChannelRow } from "./row_types";
import type { SearchWidget } from "./search_widget";

import { render_tr, render_unread_count } from "./render";

function render_num_topics(count: number): HTMLElement {
    const div = document.createElement("div");
    div.innerText = `${count}`;
    div.style.textAlign = "right";
    div.style.paddingRight = "3px";

    return div;
}

function render_channel_name(channel_name: string): HTMLElement {
    const div = document.createElement("div");
    div.innerText = "#" + channel_name;
    div.style.maxWidth = "270px";
    div.style.overflowWrap = "break-word";
    div.style.color = "#000080";
    div.style.cursor = "pointer";

    return div;
}

class ChannelRowName {
    div: HTMLElement;

    constructor(
        channel_row: ChannelRow,
        index: number,
        selected: boolean,
        search_widget: SearchWidget,
    ) {
        const div = render_channel_name(channel_row.name());

        div.addEventListener("click", () => {
            if (selected) {
                search_widget.clear_channel();
            } else {
                search_widget.set_channel_index(index);
            }
        });

        if (selected) {
            div.style.backgroundColor = "cyan";
        }

        this.div = div;
    }
}

export class ChannelRowWidget {
    tr: HTMLElement;

    constructor(
        channel_row: ChannelRow,
        index: number,
        selected: boolean,
        search_widget: SearchWidget,
    ) {
        const channel_row_name = new ChannelRowName(
            channel_row,
            index,
            selected,
            search_widget,
        );

        this.tr = render_tr([
            render_unread_count(channel_row.unread_count()),
            channel_row_name.div,
            render_num_topics(channel_row.num_topics()),
        ]);
    }
}
