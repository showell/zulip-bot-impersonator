import type { MessageRow } from "./row_types";

import * as mouse_drag from "./util/mouse_drag";

import { render_message_content } from "./message_content";
import { MessagePopup } from "./message_popup";
import { pop } from "./popup";

function render_message_box() {
    const div = document.createElement("div");

    div.style.paddingTop = "5px";
    div.style.marginBottom = "5px";
    div.style.borderBottom = "1px dotted #000080";
    div.style.fontSize = "16px";
    div.style.fontFamily = `"Source Sans 3 VF", sans-serif`;
    div.style.lineHeight = "22.4px";
    div.style.cursor = "pointer";

    return div;
}

function render_sender_name(sender_name: string): HTMLElement {
    const div = document.createElement("div");
    div.innerText = sender_name;
    div.style.fontWeight = "bold";
    div.style.fontSize = "16px";
    div.style.color = "rgb(51, 51, 51)";
    return div;
}

function time_widget(timestamp: number): HTMLDivElement {
    const div = document.createElement("div");
    const date = new Date(timestamp * 1000);
    const formatted_time = date.toLocaleString();
    div.innerText = `${formatted_time}`;
    div.style.fontSize = "12px";
    div.style.marginLeft = "5px";
    return div;
}

function top_line(message_row: MessageRow): HTMLDivElement {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.alignItems = "flex-end";
    div.style.marginTop = "12px";

    div.append(render_sender_name(message_row.sender_name()));
    div.append(time_widget(message_row.timestamp()));

    return div;
}

export class MessageRowWidget {
    div: HTMLElement;

    constructor(message_row: MessageRow) {
        const div = render_message_box();

        div.addEventListener("click", (e) => {
            if (mouse_drag.is_drag(e)) {
                return;
            }

            const message_popup = new MessagePopup(message_row);
            pop({
                div: message_popup.div,
                confirm_button_text: "Ok",
                callback() {},
            });

            e.stopPropagation();
        });

        if (message_row.unread()) {
            div.style.backgroundColor = "lavender";
        }

        if (message_row.is_super_new()) {
            div.style.border = "1px violet solid";
        }

        div.append(top_line(message_row));

        const content = message_row.content();
        const content_div = render_message_content(content);

        div.append(content_div);

        this.div = div;
    }
}
