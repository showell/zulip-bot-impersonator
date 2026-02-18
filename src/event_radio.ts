import type { ZulipEvent } from "./backend/event";

import type { TabHelper } from "./page";

import { EventFlavor } from "./backend/event";
import * as model from "./backend/model";
import { MessageRow } from "./backend/row_types";

import { MessageRowWidget } from "./message_row_widget";

export class EventRadio {
    div: HTMLDivElement;
    tab_helper?: TabHelper;

    constructor() {
        const div = document.createElement("div");

        const heading = document.createElement("div");
        heading.innerText = "(waiting for events)";
        div.style.fontWeight = "bold";

        div.append(heading);

        this.div = div;
    }

    start(tab_helper: TabHelper): void {
        this.tab_helper = tab_helper;
        tab_helper.update_label("Events");
    }

    add_event(event: ZulipEvent): void {
        const div = this.div;

        if (event.flavor === EventFlavor.STREAM_MESSAGE) {
            const message = event.stream_message;
            const use_sender = true;

            const address_div = document.createElement("div");
            const stream = model.stream_for(message.stream_id);
            address_div.innerText = `${stream.name} > ${message.topic_name}`;

            const message_row = new MessageRow(message);
            const message_row_widget = new MessageRowWidget(
                message_row,
                use_sender,
            );

            div.append(address_div);
            div.append(message_row_widget.div);
        } else {
            const json = JSON.stringify(event, null, 4);
            const elem = document.createElement("div");
            elem.innerText = json;
            div.append(elem);
        }

        this.tab_helper!.violet();

        this.scroll_to_bottom();
    }

    scroll_to_bottom(): void {
        const div = this.div;

        div.scrollTop = div.scrollHeight - div.clientHeight;
    }
}
