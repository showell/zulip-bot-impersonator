import { render_tr } from "./render";

export type CallbackType = {
    clear_message_view(): void;
    set_topic_index(index: number): void;
};

type TopicRowData = {
    name: string;
    msg_count: number;
    unread_count: number;
};

function render_topic_count(count: number): HTMLElement {
    const div = document.createElement("div");
    div.innerText = `${count}`;
    div.style.textAlign = "right";

    return div;
}

function render_unread_count(count: number): HTMLElement {
    const div = document.createElement("div");
    div.innerText = count ? `${count}` : "";
    div.style.textAlign = "right";
    div.style.padding = "2px";

    if (count > 0) {
        div.style.backgroundColor = "lavender";
    }

    return div;
}

function render_topic_name(topic_name: string): HTMLElement {
    const div = document.createElement("div");
    div.innerText = topic_name;
    div.style.maxWidth = "270px";
    div.style.overflowWrap = "break-word";
    div.style.color = "#000080";
    div.style.cursor = "pointer";
    div.style.paddingLeft = "3px";

    return div;
}

class TopicRowName {
    div: HTMLElement;

    constructor(
        topic_name: string,
        index: number,
        selected: boolean,
        callbacks: CallbackType,
    ) {
        const div = render_topic_name(topic_name);

        div.addEventListener("click", () => {
            if (selected) {
                callbacks.clear_message_view();
            } else {
                callbacks.set_topic_index(index);
            }
        });

        if (selected) {
            div.style.backgroundColor = "cyan";
        }

        this.div = div;
    }
}

export class TopicRow {
    tr: HTMLElement;

    constructor(
        row_data: TopicRowData,
        index: number,
        selected: boolean,
        callbacks: CallbackType,
    ) {
        const topic_row_name = new TopicRowName(
            row_data.name,
            index,
            selected,
            callbacks,
        );

        const tr = render_tr([
            render_topic_count(row_data.msg_count),
            render_unread_count(row_data.unread_count),
            topic_row_name.div,
        ]);

        this.tr = tr;
    }
}
