import type { Stream } from "./db_types";

import { ComposeBox } from "./compose";
import { Topic } from "./db_types";
import * as model from "./model";
import { render_list_heading, render_pane } from "./render";

function render_heading(stream_name: string): HTMLElement {
    const title = `Start new topic on channel: ${stream_name}`;
    const div = render_list_heading(title);

    div.style.color = "violet";

    return div;
}

export class AddTopicPane {
    div: HTMLElement;
    compose_box: ComposeBox;

    constructor(stream: Stream) {
        const div = render_pane();

        const compose_box = this.make_compose_box(stream);

        div.innerHTML = "";
        div.style.height = "fit-content";

        div.append(render_heading(stream.name));
        div.append(compose_box.div);

        this.div = div;
        this.compose_box = compose_box;
    }

    make_compose_box(stream: Stream): ComposeBox {
        const blank_name = "";
        const topic = new Topic(stream.stream_id, blank_name);
        return new ComposeBox(topic);
    }

    focus_compose_box(): void {
        this.compose_box.focus_topic_input();
    }
}
