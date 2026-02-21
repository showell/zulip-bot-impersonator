import type { SearchWidget } from "./search_widget";

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

class TopicRowName {
    div: HTMLDivElement;

    constructor(
        topic_name: string,
        index: number,
        selected: boolean,
        search_widget: SearchWidget,
    ) {
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

        this.div = div;
    }
}

export class TopicRowWidget {
    divs: HTMLDivElement[];

    constructor(
        row_data: TopicRowData,
        index: number,
        selected: boolean,
        search_widget: SearchWidget,
    ) {
        const topic_row_name = new TopicRowName(
            row_data.name,
            index,
            selected,
            search_widget,
        );

        this.divs = [
            render_unread_count(row_data.unread_count),
            topic_row_name.div,
            render_topic_count(row_data.msg_count),
        ];
    }
}
