let Callbacks: CallbackType;

type CallbackType = {
    clear_stream(): void;
    stream_up(): void;
    stream_down(): void;
    clear_topic(): void;
    topic_up(): void;
    topic_down(): void;
};

function render_div_button(label: string): HTMLElement {
    const div = document.createElement("div");
    div.style.padding = "3px";

    const button = document.createElement("button");
    button.innerText = label;
    button.style.color = "white";
    button.style.backgroundColor = "#000080";

    button.addEventListener("focus", () => {
        button.style.backgroundColor = "green";
    });

    button.addEventListener("blur", () => {
        button.style.backgroundColor = "#000080";
    });

    div.append(button);
    return div;
}

function stream_up_button(): HTMLElement {
    const div = render_div_button("prev channel");

    div.addEventListener("click", () => {
        Callbacks.stream_up();
    });

    return div;
}

function stream_down_button(): HTMLElement {
    const div = render_div_button("next channel");

    div.addEventListener("click", () => {
        Callbacks.stream_down();
    });

    return div;
}

function stream_clear_button() {
    const div = render_div_button("clear channel");

    div.addEventListener("click", () => {
        Callbacks.clear_stream();
    });

    return div;
}

function topic_up_button(): HTMLElement {
    const div = render_div_button("prev topic");

    div.addEventListener("click", () => {
        Callbacks.topic_up();
    });

    return div;
}

function topic_down_button() {
    const div = render_div_button("next topic");

    div.addEventListener("click", () => {
        Callbacks.topic_down();
    });

    return div;
}

function topic_clear_button() {
    const div = render_div_button("clear topic");

    div.addEventListener("click", () => {
        Callbacks.clear_topic();
    });

    return div;
}

export class ButtonPanel {
    div: HTMLElement;
    first_button: HTMLElement;

    constructor(callbacks: CallbackType) {
        Callbacks = callbacks;

        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.paddingBottom = "4px";

        div.append(stream_up_button());
        div.append(stream_down_button());
        div.append(stream_clear_button());

        div.append(topic_up_button());
        div.append(topic_down_button());
        div.append(topic_clear_button());

        this.first_button = div.querySelectorAll("button")[1];
        this.div = div;
    }

    focus_first_button() {
        console.log(this.first_button);
        this.first_button.focus();
    }
}
