type CallbackType = {
    clear_stream(): void;
    stream_up(): void;
    stream_down(): void;
    clear_topic(): void;
    topic_up(): void;
    topic_down(): void;
};

type DivButton = {
    div: HTMLElement;
    button: HTMLElement;
};

function render_div_button(label: string): DivButton {
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
    return { div, button };
}

class Button {
    div: HTMLElement;
    button: HTMLElement;

    constructor(label: string, callback: () => void) {
        const { div, button } = render_div_button(label);
        this.div = div;
        this.button = button;

        button.addEventListener("click", () => {
            callback();
        });
    }

    focus(): void {
        this.button.focus();
    }
}

export class ButtonPanel {
    div: HTMLElement;
    next_channel: Button;
    prev_channel: Button;
    clear_channel: Button;
    next_topic: Button;
    prev_topic: Button;
    clear_topic: Button;

    constructor(callbacks: CallbackType) {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.paddingBottom = "4px";

        this.next_channel = new Button("next channel", () => {
            callbacks.stream_down();
        });
        this.prev_channel = new Button("prev channel", () => {
            callbacks.stream_up();
        });
        this.clear_channel = new Button("clear channel", () => {
            callbacks.clear_stream();
        });

        this.next_topic = new Button("next topic", () => {
            callbacks.topic_down();
        });
        this.prev_topic = new Button("prev topic", () => {
            callbacks.topic_up();
        });
        this.clear_topic = new Button("clear topic", () => {
            callbacks.clear_topic();
        });
        this.div = div;

        this.populate();
    }

    populate(): void {
        const div = this.div;

        div.innerHTML = "";

        function show(button: Button) {
            div.append(button.div);
        }

        show(this.next_channel);
        show(this.prev_channel);
        show(this.clear_channel);

        show(this.next_topic);
        show(this.prev_topic);
        show(this.clear_topic);

        this.next_channel.focus();
    }
}
