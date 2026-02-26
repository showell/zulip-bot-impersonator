import * as zulip_client from "./backend/zulip_client";
import { config } from "./secrets";

function preprocess_img_element(img: HTMLImageElement) {
    let src = img.src;
    const origin = window.location.origin;

    if (src.startsWith(origin)) {
        src = src.slice(origin.length);

        if (src.startsWith("/user_uploads/")) {
            img.setAttribute("src", config.realm_url + src);

            async function use_temporary_url() {
                let original_src;
                const parts = src.slice(1).split("/");
                if (parts[1] === "thumbnail") {
                    original_src =
                        "/user_uploads/" + parts.slice(2, -1).join("/");
                } else {
                    original_src = "/" + parts.join("/");
                }
                const temp_src = await zulip_client.fetch_image(original_src);
                img.setAttribute("src", temp_src);
                img.style.width = "350px";
                img.addEventListener("click", (e) => {
                    // we don't have an image viewer
                    alert("use left click for now, please");
                    e.stopPropagation();
                    e.preventDefault();
                });
            }

            use_temporary_url();
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
