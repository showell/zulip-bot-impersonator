import { render_list_heading } from "./dom/render";

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

export function layout_pane_div(div: HTMLDivElement) {
    div.style.backgroundColor = "white";
    div.style.paddingTop = "10px";
    div.style.paddingBottom = "10px";
    div.style.paddingLeft = "13px";
    div.style.paddingRight = "13px";
    div.style.borderRadius = "8px";
    div.style.border = "1px #CCCCFF solid";
    div.style.marginRight = "12px";
    div.style.height = "fit-content";
}

function layout_main_pane_div(div: HTMLDivElement): void {
    div.style.paddingRight = "5px";
    div.style.marginBottom = "4px";
    div.style.maxHeight = "70vh";
    div.style.overflowY = "auto";
}

export function draw_table_pane(
    pane_div: HTMLDivElement,
    heading_text: string,
    table_div: HTMLDivElement,
) {
    layout_pane_div(pane_div);

    pane_div.innerHTML = "";
    pane_div.append(render_list_heading(heading_text));

    const main_div = document.createElement("div");
    layout_main_pane_div(main_div);
    main_div.append(table_div);
    pane_div.append(main_div);
}

export function draw_list_pane(
    pane_div: HTMLDivElement,
    header_div: HTMLDivElement,
    list_div: HTMLDivElement,
): void {
    layout_pane_div(pane_div);

    pane_div.innerHTML = "";
    pane_div.append(header_div);
    pane_div.append(list_div);
    layout_main_pane_div(list_div);
}
