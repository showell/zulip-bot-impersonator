import { config } from "./secrets";

function preprocess_img_element(img: HTMLImageElement) {
    console.log("img.src", img.src);

    let src = img.src;
    const origin = window.location.origin;

    if (src.startsWith(origin)) {
        src = src.slice(origin.length);

        if (src.startsWith("/user_uploads/thumbnail")) {
            img.setAttribute("src", config.realm_url + src);
            console.log("fixed but not authorized", img.src);
        }
    }
}

function preprocess_anchor_element(ele: HTMLAnchorElement) {
    const a_href = ele.getAttribute("href");

    if (!a_href || a_href === "http://") {
        // This happens with an empty link. This is a quick hack to ignore
        // it.
        return;
    }

    console.log(a_href);
    const url = new URL(a_href, window.location.href);

    if (
        url.hash === "" ||
        url.href !== new URL(url.hash, window.location.href).href
    ) {
        ele.setAttribute("target", "_blank");
        ele.setAttribute("rel", "noopener noreferrer");

        const origin = window.location.origin;

        if (url.href.startsWith(origin)) {
            const frag = url.href.slice(origin.length);
            ele.setAttribute("href", config.realm_url + frag);
        }
    }

    // Link clicks shouldn't propagate to trigger the popup
    // with message details.
    ele.addEventListener("click", (e) => e.stopPropagation());
}

function preprocess_message_content(html_content: string): DocumentFragment {
    const template = document.createElement("template");
    template.innerHTML = html_content;
    template.content
        .querySelectorAll("a")
        .forEach((ele) => preprocess_anchor_element(ele));
    template.content
        .querySelectorAll("img")
        .forEach((ele) => preprocess_img_element(ele));
    return template.content;
}

export function render_message_content(content: string): HTMLElement {
    const div = document.createElement("div");
    div.classList.add("rendered_markdown");
    div.style.marginLeft = "20px";
    div.style.marginRight = "20px";
    div.append(preprocess_message_content(content));
    return div;
}
