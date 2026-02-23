export function topic_input(topic_name: string): HTMLInputElement {
    const input = document.createElement("input");

    input.type = "text";
    input.placeholder = topic_name ? "" : "name your new topic";
    input.value = topic_name;
    input.style.width = "270px";

    return input;
}

export function labeled_input(name: string, input: HTMLInputElement) {
    const label = document.createElement("label");

    const name_div = document.createElement("div");
    name_div.innerText = name;
    name_div.style.marginRight = "7px";
    name_div.style.marginBottom = "14px";
    name_div.style.display = "inline-block";

    label.append(name_div);
    label.append(input);

    return label;
}

export function render_textarea(): HTMLTextAreaElement {
    const elem = document.createElement("textarea");
    elem.placeholder = "Enter some text to send.";
    elem.style.width = "350px";
    elem.style.height = "250px";

    return elem;
}

export function button_row_div(): HTMLDivElement {
    const div = document.createElement("div");

    div.style.display = "flex";
    div.style.justifyContent = "end";

    return div;
}
