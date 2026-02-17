import type { TopicRow } from "./backend/db_types";

function render_topic_heading_count(count: number): HTMLElement {
    const div = document.createElement("div");
    div.innerText = `(${count} messages)`;
    div.style.padding = "2px";
    div.style.marginLeft = "3px";

    return div;
}

function render_topic_heading(topic_row: TopicRow): HTMLElement {
    const div = document.createElement("div");
    div.innerText = topic_row.topic.name;
    div.style.color = "#000080";
    div.style.paddingBottom = "0px";
    div.style.fontSize = "19px";

    if (topic_row.unread_count > 0) {
        div.style.backgroundColor = "lavender";
    }

    return div;
}

export class MessageViewHeader {
    div: HTMLElement;

    constructor(topic_row: TopicRow) {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.borderBottom = "1px solid black";
        div.style.paddingBottom = "4px";
        div.style.marginBottom = "12px";

        div.append(render_topic_heading(topic_row));
        div.append(render_topic_heading_count(topic_row.msg_count));

        this.div = div;
    }
}
