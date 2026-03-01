export function tab_button(): HTMLButtonElement {
    const button = document.createElement("button");
    button.style.borderBottom = "none";
    button.style.fontSize = "16px";
    button.style.paddingLeft = "13px";
    button.style.paddingRight = "13px";
    button.style.paddingTop = "4px";
    button.style.paddingBottom = "4px";
    button.style.borderTopRightRadius = "10px";
    button.style.borderTopLeftRadius = "10px";

    return button;
}
