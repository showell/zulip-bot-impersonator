import type { Message } from "./db_types";

import * as model from "./model";
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

function render_avatar(avatar_url: string): HTMLElement {
    const div = document.createElement("div");
    const img = document.createElement("img");

    img.width = 20;
    img.height = 20;
    img.style.objectFit = "cover";

    img.src = avatar_url;

    div.append(img);

    return div;
}

class MessageSender {
    div: HTMLElement;

    constructor(sender_id: number) {
        const div = document.createElement("div");
        div.style.display = "flex";

        const user = model.UserMap.get(sender_id);

        const avatar_url = user?.avatar_url;

        if (avatar_url) {
            div.append(render_avatar(avatar_url));
        }

        div.append(render_sender_name(user?.full_name ?? "unknown"));

        this.div = div;
    }
}

export class MessageRow {
    div: HTMLElement;

    constructor(message: Message, sender_id: number | undefined) {
        const div = document.createElement("div");

        div.style.paddingTop = "5px";
        div.style.marginBottom = "5px";
        div.style.borderBottom = "1px dotted #000080";
        div.style.maxWidth = "500px";
        div.style.fontSize = "16px";
        div.style.fontFamily = `"Source Sans 3 VF", sans-serif`;
        div.style.color = "rgb(38, 38, 38)";
        div.style.lineHeight = "22.4px";

        if (message.unread) {
            div.style.backgroundColor = "lavender";
        }

        if (message.is_super_new) {
            div.style.border = "1px violet solid";
        }

        if (sender_id) {
            const sender = new MessageSender(sender_id);
            div.append(sender.div);
        }

        const content_div = render_message_content(message.content);
        content_div.classList.add("rendered_markdown");

        div.append(content_div);

        this.div = div;
    }
}
