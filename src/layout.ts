import { render_list_heading } from "./render";

export function redraw_page(
    page_div: HTMLDivElement,
    navbar_div: HTMLDivElement,
    plugin_div: HTMLDivElement,
): void {
    page_div.innerHTML = "";
    page_div.append(navbar_div);
    page_div.append(plugin_div);

    plugin_div.style.marginTop = "7px";
    page_div.style.height = "100uv";
}

export function make_navbar(
    status_bar_div: HTMLDivElement,
    button_bar_div: HTMLDivElement,
) {
    const navbar_div = document.createElement("div");
    navbar_div.append(status_bar_div);
    navbar_div.append(button_bar_div);
    navbar_div.style.position = "sticky";
    navbar_div.style.marginTop = "8px";
    navbar_div.style.top = "0px";
    navbar_div.style.zIndex = "100";

    return navbar_div;
}

export function draw_search_widget(
    search_widget_div: HTMLDivElement,
    button_panel_div: HTMLDivElement,
    pane_manager_div: HTMLDivElement,
) {
    search_widget_div.innerHTML = "";

    search_widget_div.append(button_panel_div);
    search_widget_div.append(pane_manager_div);
}

export function draw_table_pane(
    pane_div: HTMLDivElement,
    heading_text: string,
    table_div: HTMLDivElement,
) {
    pane_div.innerHTML = "";
    pane_div.append(render_list_heading(heading_text));
    pane_div.append(table_div);
}
