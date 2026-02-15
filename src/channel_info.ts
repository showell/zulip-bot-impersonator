import { render_message_content } from "./message_content";
import * as model from "./model";
import { render_pane } from "./render";

function render_text(text: string) {
    const div = document.createElement("div");

    div.innerText = text;
    return div;
}

export class ChannelInfo {
    div: HTMLElement;

    constructor(stream_id: number) {
        const div = render_pane();

        const stream = model.stream_for(stream_id);

        const name = stream.name;

        console.log(stream.rendered_description);
        if (stream.rendered_description) {
            div.append(render_message_content(stream.rendered_description));
        }

        if (stream.stream_weekly_traffic) {
            div.append(render_text(`traffic: about ${stream.stream_weekly_traffic} messages per week`));
        }

        this.div = div;
    }
}

