import type { Topic } from "./backend/db_types";

import * as model from "./backend/model";

import { ComposeBox } from "./compose";
import { render_list_heading, render_pane } from "./render";

function render_heading(stream_name: string): HTMLElement {
    const title = `Send message to channel: ${stream_name}`;
    const div = render_list_heading(title);

    div.style.color = "green";

    return div;
}

export class ReplyPane {
    div: HTMLElement;
    compose_box: ComposeBox;

    constructor(topic: Topic) {
        const div = render_pane();

        div.innerHTML = "";
        div.style.height = "fit-content";

        const stream_name = model.stream_name_for(topic.stream_id);
        div.append(render_heading(stream_name));

        const compose_box = new ComposeBox(topic);
        div.append(compose_box.div);

        this.div = div;
        this.compose_box = compose_box;
    }

    get_compose_box(): ComposeBox {
        return this.compose_box;
    }
}
