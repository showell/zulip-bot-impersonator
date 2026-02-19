import type { Topic } from "./backend/db_types";

import * as outbound from "./backend/outbound";

import { Button } from "./button";

function render_textarea(): HTMLTextAreaElement {
    const elem = document.createElement("textarea");
    elem.placeholder = "Enter some text to send.";
    elem.style.width = "350px";
    elem.style.height = "250px";

    return elem;
}

function labeled_input(name: string, input: HTMLInputElement) {
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

class TopicInput {
    div: HTMLElement;
    topic_input: HTMLInputElement;

    constructor(topic_name: string) {
        const div = document.createElement("div");

        const topic_input = this.make_topic_input(topic_name);
        const label = labeled_input("Topic:", topic_input);

        div.append(label);

        this.topic_input = topic_input;
        this.div = div;
    }

    make_topic_input(topic_name: string): HTMLInputElement {
        const input = document.createElement("input");

        input.type = "text";
        input.placeholder = topic_name ? "" : "name your new topic";
        input.value = topic_name;
        input.style.width = "300px";

        return input;
    }

    focus(): void {
        this.topic_input.focus();
    }

    topic_name(): string {
        return this.topic_input.value;
    }
}

class TextArea {
    div: HTMLElement;
    elem: HTMLTextAreaElement;

    constructor() {
        const div = document.createElement("div");

        const elem = render_textarea();
        div.append(elem);

        this.div = div;
        this.elem = elem;
    }

    contents(): string {
        return this.elem.value;
    }

    clear(): void {
        this.elem.value = "";
    }

    focus(): void {
        this.elem.focus();
    }
}

export class ComposeBox {
    div: HTMLElement;
    topic_input: TopicInput;
    textarea: TextArea;
    topic: Topic;

    constructor(topic: Topic) {
        const self = this;
        this.topic = topic;

        const div = document.createElement("div");

        const topic_input = new TopicInput(topic.name);

        const textarea = new TextArea();

        div.append(topic_input.div);
        div.append(textarea.div);
        div.append(self.button_row());

        document.body.append(div);

        this.topic_input = topic_input;
        this.div = div;
        this.textarea = textarea;
    }

    focus_textarea(): void {
        this.textarea.focus();
    }

    button_row(): HTMLElement {
        const self = this;
        const div = document.createElement("div");

        div.style.display = "flex";
        div.style.justifyContent = "end";

        const send_button = new Button("Send", () => {
            // TODO: save draft
            const content = self.get_content_to_send();
            this.textarea.clear();
            this.textarea.focus();
            self.send(content);
        });

        div.append(send_button.div);

        return div;
    }

    get_content_to_send(): string {
        return this.textarea.contents();
    }

    send(content: string): void {
        const stream_id = this.topic.stream_id;
        const topic_name = this.topic_input.topic_name();

        outbound.send_message({ stream_id, topic_name, content });
    }

    focus_topic_input(): void {
        this.topic_input.focus();
    }
}
