export function redraw_page(
    page_div: HTMLDivElement,
    navbar_div: HTMLDivElement,
    container_div: HTMLDivElement,
): void {
    page_div.innerHTML = "";
    page_div.append(navbar_div);
    page_div.append(container_div);
}

