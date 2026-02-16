import type { Topic } from "./db_types";

function render_topic_heading_count(topic: Topic): HTMLElement {
    const div = document.createElement("div");
    div.innerText = `(${topic.msg_count} messages)`;
    div.style.padding = "2px";
    div.style.marginLeft = "3px";

    return div;
}

function render_topic_heading(topic: Topic): HTMLElement {
    const div = document.createElement("div");
    div.innerText = topic.name;
    div.style.color = "#000080";
    div.style.paddingBottom = "0px";
    div.style.fontSize = "19px";

    if (topic.unread_count > 0) {
        div.style.backgroundColor = "lavender";
    }

    return div;
}

export class MessageViewHeader {
    div: HTMLElement;

    constructor(topic: Topic) {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.borderBottom = "1px solid black";
        div.style.paddingBottom = "4px";
        div.style.marginBottom = "12px";

        div.append(render_topic_heading(topic));
        div.append(render_topic_heading_count(topic));

        this.div = div;
    }
}
