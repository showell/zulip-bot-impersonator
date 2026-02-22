import { render_th, render_thead, render_tr } from "./render";

export type RowWidget = {
    divs: HTMLDivElement[];
};

export class TableWidget {
    table: HTMLTableElement;

    constructor(columns: string[], row_widgets: RowWidget[]) {
        const thead = this.make_thead(columns);
        const tbody = this.make_tbody(row_widgets);

        const table = document.createElement("table");
        table.append(thead);
        table.append(tbody);

        table.style.borderCollapse = "collapse";

        this.table = table;
    }

    make_thead(columns: string[]): HTMLTableSectionElement {
        const thead = render_thead(columns.map((col) => render_th(col)));
        return thead;
    }

    make_tbody(row_widgets: RowWidget[]): HTMLTableSectionElement {
        const tbody = document.createElement("tbody");

        for (const row_widget of row_widgets) {
            tbody.append(render_tr(row_widget.divs));
        }

        return tbody;
    }
}
