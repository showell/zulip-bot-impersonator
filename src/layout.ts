export function redraw_page(
    page_div: HTMLDivElement,
    navbar_div: HTMLDivElement,
    plugin_div: HTMLDivElement,
): void {
    page_div.innerHTML = "";
    page_div.append(navbar_div);
    page_div.append(plugin_div);

    page_div.style.height = "100uv";
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


