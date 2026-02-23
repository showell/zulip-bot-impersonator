import { ComposeBox } from "./compose";
import { render_list_heading, render_pane } from "./render";
import { TopicRow } from "./row_types";

function render_heading(stream_name: string): HTMLElement {
    const title = `Send message to channel: ${stream_name}`;
    const div = render_list_heading(title);

    div.style.color = "green";

    return div;
}

export class ReplyPane {
    div: HTMLElement;
    compose_box: ComposeBox;

    constructor(topic_row: TopicRow) {
        const div = render_pane();

        div.innerHTML = "";
        div.style.height = "fit-content";

        div.append(render_heading(topic_row.stream_name()));

        const stream_id = topic_row.stream_id();
        const topic_name = topic_row.name();
        const compose_box = new ComposeBox(stream_id, topic_name);
        div.append(compose_box.div);

        this.div = div;
        this.compose_box = compose_box;
    }

    get_compose_box(): ComposeBox {
        return this.compose_box;
    }
}
