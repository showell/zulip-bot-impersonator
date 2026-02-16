import { config } from "./secrets.ts";

function preprocess_anchor_element(ele: HTMLAnchorElement) {
    const url = new URL(ele.getAttribute("href")!, window.location.href);

    if (
        url.hash === "" ||
        url.href !== new URL(url.hash, window.location.href).href
    ) {
        ele.setAttribute("target", "_blank");
        ele.setAttribute("rel", "noopener noreferrer");

        const origin = window.location.origin;

        if (url.href.startsWith(origin)) {
            const frag = url.href.slice(origin.length);
            const new_href = config.realm_url + frag;
            ele.setAttribute("href", config.realm_url + frag);
        }
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
    console.log(content);
    const div = document.createElement("div");
    div.append(preprocess_message_content(content));
    return div;
}
