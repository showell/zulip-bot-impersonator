import * as popup from "./popup";

export function show_image_in_popup(src: string) {
    let ratio = 0;

    function img_element(): HTMLDivElement {
        const img = document.createElement("img");
        img.src = src;
        img.style.height = "70vh";
        img.style.width = "auto";
        img.style.position = "absolute";
        img.style.objectFit = "cover";

        return img;
    }

    function range_element(): HTMLInputElement {
        const range = document.createElement("input");
        range.type = "range";
        range.min = "2";
        range.max = "500";
        range.value = "70";

        range.oninput = () => {
            img.style.height = `${range.value}vh`;
        };

        return range;
    }

    const img_div = document.createElement("div");
    img_div.style.height = "70vh";
    img_div.style.width = "70vw";
    img_div.style.position = "relative";
    img_div.style.overflow = "auto";

    const img = img_element();
    img_div.append(img);

    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "column";

    div.append(range_element());
    div.append(img_div);

    popup.pop({
        div,
        confirm_button_text: "Ok",
        callback: () => {
            ratio = parseFloat(img.style.height) / parseFloat(img.style.width);
            console.log(ratio);
        },
    });
}
