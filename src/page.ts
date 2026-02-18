export class Page {
    div: HTMLElement;

    constructor() {
        const div = document.createElement("div");
        div.innerText =
            "Welcome to Zulip! loading users and recent messages...";

        document.body.append(div);

        this.div = div;
    }

    add_widget(inner_div: HTMLElement) {
        this.div.innerHTML = "";
        this.div.append(inner_div);
    }
}

