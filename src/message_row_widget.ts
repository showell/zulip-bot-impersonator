import type { MessageRow } from "./backend/row_types";

import { render_message_content } from "./message_content";

function render_sender_name(sender_name: string): HTMLElement {
    const div = document.createElement("div");
    div.innerText = sender_name;
    div.style.fontWeight = "bold";
    div.style.fontSize = "16px";
    div.style.color = "rgb(51, 51, 51)";
    div.style.lineHeight = "35px";
    div.style.marginTop = "2px";
    return div;
}

class MessageSender {
    div: HTMLElement;

    constructor(message_row: MessageRow) {
        const div = document.createElement("div");
        div.style.display = "flex";

        div.append(render_sender_name(message_row.sender_name()));

        this.div = div;
    }
}

export class MessageRowWidget {
    div: HTMLElement;

    constructor(message_row: MessageRow, show_sender: boolean) {
        const div = document.createElement("div");

        div.style.paddingTop = "5px";
        div.style.marginBottom = "5px";
        div.style.borderBottom = "1px dotted #000080";
        div.style.maxWidth = "500px";
        div.style.fontSize = "16px";
        div.style.fontFamily = `"Source Sans 3 VF", sans-serif`;
        div.style.color = "rgb(38, 38, 38)";
        div.style.lineHeight = "22.4px";

        if (message_row.unread()) {
            div.style.backgroundColor = "lavender";
        }

        if (message_row.is_super_new()) {
            div.style.border = "1px violet solid";
        }

        if (show_sender) {
            const sender = new MessageSender(message_row);
            div.append(sender.div);
        }

        const content = message_row.content();
        const content_div = render_message_content(content);
        content_div.classList.add("rendered_markdown");

        div.append(content_div);

        this.div = div;
    }
}
