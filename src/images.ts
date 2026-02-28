import * as popup from "./popup";

export function show_image_in_popup(src: string) {
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = src;
    img.style.width = "70vw";
    div.append(img);
    div.style.overflowX = "auto";
    div.style.overflowY = "auto";
    popup.pop({
        div,
        confirm_button_text: "Ok",
        callback: () => {},
    });
}
