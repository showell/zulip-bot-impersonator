function preprocess_anchor_element(ele: HTMLAnchorElement) {
    const url = new URL(ele.getAttribute("href")!, window.location.href);
    if (
        url.hash === "" ||
        url.href !== new URL(url.hash, window.location.href).href
    ) {
        ele.setAttribute("target", "_blank");
        ele.setAttribute("rel", "noopener noreferrer");
    }
}

function preprocess_message_content(html_content: string): DocumentFragment {
    const template = document.createElement("template");
    template.innerHTML = html_content;
    template.content
        .querySelectorAll("a")
        .forEach((ele) => preprocess_anchor_element(ele));
    return template.content;
}

export function render_message_content(content: string): HTMLElement {
    const div = document.createElement("div");
    div.append(preprocess_message_content(content));
    return div;
}
