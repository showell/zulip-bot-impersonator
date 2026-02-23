import { render_th, render_thead, render_tr } from "./render";

export type RowWidget = {
    divs: HTMLDivElement[];
};

export function table(
    columns: string[],
    row_widgets: RowWidget[],
): HTMLTableElement {
    function make_tbody(): HTMLTableSectionElement {
        const tbody = document.createElement("tbody");

        for (const row_widget of row_widgets) {
            tbody.append(render_tr(row_widget.divs));
        }

        return tbody;
    }

    const thead = render_thead(columns.map((col) => render_th(col)));
    const tbody = make_tbody();

    const table = document.createElement("table");
    table.append(thead);
    table.append(tbody);

    table.style.borderCollapse = "collapse";

    return table;
}
