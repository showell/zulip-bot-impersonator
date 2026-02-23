import type { SearchWidget } from "../search_widget";

import { render_unread_count } from "./render";

type TopicRowData = {
    name: string;
    msg_count: number;
    unread_count: number;
};

function render_topic_count(count: number): HTMLDivElement {
    const div = document.createElement("div");
    div.innerText = `${count}`;
    div.style.textAlign = "right";
    div.style.paddingRight = "3px";

    return div;
}

function render_topic_name(topic_name: string): HTMLDivElement {
    const div = document.createElement("div");
    div.innerText = "> " + topic_name;
    div.style.maxWidth = "270px";
    div.style.overflowWrap = "break-word";
    div.style.color = "#000080";
    div.style.cursor = "pointer";
    div.style.paddingLeft = "3px";

    return div;
}

function render_name_div(
    topic_name: string,
    index: number,
    selected: boolean,
    search_widget: SearchWidget,
): HTMLDivElement {
    const div = render_topic_name(topic_name);

    div.addEventListener("click", () => {
        if (selected) {
            search_widget.clear_message_view();
        } else {
            search_widget.set_topic_index(index);
        }
    });

    if (selected) {
        div.style.backgroundColor = "cyan";
    }

    return div;
}

export function row_widget(
    row_data: TopicRowData,
    index: number,
    selected: boolean,
    search_widget: SearchWidget,
): { divs: HTMLDivElement[] }{
    const name_div = render_name_div(
        row_data.name,
        index,
        selected,
        search_widget,
    );

    return {
        divs: [
            render_unread_count(row_data.unread_count),
            name_div,
            render_topic_count(row_data.msg_count),
        ],
    };
}
