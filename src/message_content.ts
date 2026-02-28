import * as zulip_client from "./backend/zulip_client";
import { config } from "./secrets";

import * as mouse_drag from "./util/mouse_drag";

import { APP } from "./app";
import * as address from "./address";
import * as popup from "./popup";

function fix_code_blocks(code_div: Element) {
    code_div.addEventListener("click", (e) => {
        if (mouse_drag.is_drag(e)) {
            return;
        }

        const heading = document.createElement("div");
        heading.innerText = "Raw Code View";
        heading.style.fontSize = "25px";
        heading.style.fontWeight = "bold";

        const code = document.createElement("pre");
        code.innerText = code_div.textContent;
        code.tabIndex = 0;
        code.style.fontSize = "20px";
        code.style.overflowX = "auto";
        code.style.overflowY = "auto";
        code.style.maxHeight = "80vh";
        code.style.maxWidth = "80vw";
        code.style.padding = "10px";

        const div = document.createElement("div");
        div.append(heading);
        div.append(code);

        popup.pop({
            div,
            confirm_button_text: "Ok",
            callback: () => {
                // nothing to do
            },
        });

        code.focus();

        e.stopPropagation();
        e.preventDefault();
    });
}

function fix_images(img: HTMLImageElement) {
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
                img.src = temp_src;
                img.style.width = "90%";

                img.addEventListener("click", (e) => {
                    const div = document.createElement("div");
                    const img = document.createElement("img");
                    img.src = temp_src;
                    img.style.width = "70vw";
                    div.append(img);
                    div.style.overflowX = "auto";
                    div.style.overflowY = "auto";
                    popup.pop({
                        div,
                        confirm_button_text: "Ok",
                        callback: () => {},
                    });

                    e.stopPropagation();
                    e.preventDefault();
                });
            }

            use_temporary_url();
        }
    }
}

function fix_in_site_link(anchor_elem: HTMLAnchorElement) {
    anchor_elem.addEventListener("click", (e) => {
        const path = anchor_elem.getAttribute("href")!;
        const addr = address.get_address_from_path(path);
        if (addr) {
            APP.add_search_widget(addr);
        } else {
            console.log("could not understand path", path);
        }
        e.stopPropagation();
        e.preventDefault();
    });
}

function fix_anchor_links(ele: HTMLAnchorElement) {
    const a_href = ele.getAttribute("href");

    if (!a_href || a_href === "http://") {
        // This happens with an empty link. This is a quick hack to ignore
        // it.
        return;
    }

    if (a_href.startsWith("/#narrow/channel")) {
        fix_in_site_link(ele);
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

function fix_emojis(elem: Element) {
    const span = elem as HTMLSpanElement;

    const emoji_unicode = Array.from(span.classList)[1];

    if (emoji_unicode === undefined) {
        return;
    }

    const unicode_hex = emoji_unicode.split("-")[1];

    if (unicode_hex === undefined) {
        return;
    }

    const ch = String.fromCodePoint(parseInt(unicode_hex, 16));

    span.innerText = ch;
    span.style.fontSize = "30px";
    span.style.marginTop = "3px";
    span.style.marginBottom = "2px";
    span.style.display = "inline-block";
}

function fix_content(html_content: string): DocumentFragment {
    const template = document.createElement("template");
    template.innerHTML = html_content;
    template.content
        .querySelectorAll("a")
        .forEach((ele) => fix_anchor_links(ele));
    template.content.querySelectorAll("img").forEach((ele) => fix_images(ele));
    template.content
        .querySelectorAll("span.emoji")
        .forEach((ele) => fix_emojis(ele));
    template.content
        .querySelectorAll("div.codehilite")
        .forEach((ele) => fix_code_blocks(ele));
    return template.content;
}

export function render_message_content(content: string): HTMLElement {
    const div = document.createElement("div");
    div.classList.add("rendered_markdown");
    div.style.marginLeft = "20px";
    div.style.marginRight = "20px";
    div.append(fix_content(content));
    return div;
}
