import { MessageRow } from "./row_types";

export class MessagePopup {
    div: HTMLDivElement;

    constructor(message_row: MessageRow) {
        const div = document.createElement("div");

        div.innerText = message_row.address_string();

        this.div = div;
    }
}

