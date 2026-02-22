import { MessageRow } from "./row_types";
import { TableWidget } from "./table_widget";

function text(s: string): HTMLDivElement {
    const div = document.createElement("div");
    div.innerText = s;
    return div;
}

function link_table(message_row: MessageRow): HTMLTableElement {
    const columns = ["Mention type", "Syntax"];

    const row_widgets = [
        { divs: [text("Sender mention"), text(message_row.sender_mention())] },
    ];

    const table_widget = new TableWidget(columns, row_widgets);

    return table_widget.table;
}

export class MessagePopup {
    div: HTMLDivElement;

    constructor(message_row: MessageRow) {
        const div = document.createElement("div");

        div.append(link_table(message_row));

        this.div = div;
    }
}
