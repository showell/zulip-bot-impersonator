class Button {
    div: HTMLElement;

    constructor(index: number, page: Page) {
        const div = document.createElement("div");
        const button = document.createElement("button");
        button.innerText = `tab ${index}`;

        button.addEventListener("click", () => {
            page.open(index);
        });

        div.append(button);

        this.div = div;
    }
}


export class Page {
    div: HTMLElement;
    button_bar: HTMLElement;
    container_div: HTMLElement;
    widget_divs: HTMLElement[];

    constructor() {
        const div = document.createElement("div");
        div.innerText =
            "Welcome to Zulip! loading users and recent messages...";

        const button_bar = document.createElement("div");
        button_bar.style.display = "flex";
        button_bar.style.marginBottom = "5px";

        const container_div = document.createElement("div");

        this.widget_divs = [];

        this.button_bar = button_bar;
        this.container_div = container_div;
        this.div = div;
    }

    add_widget(widget_div: HTMLElement): void {
        const page = this;
        const div = this.div;
        const widget_divs = this.widget_divs;
        const button_bar = this.button_bar;

        const index = widget_divs.length;

        const button = new Button(index, page);

        widget_divs.push(widget_div);

        this.button_bar.append(button.div);

        this.open(index);
    }

    open(index: number) {
        const div = this.div;
        const button_bar = this.button_bar;
        const container_div = this.container_div;
        const widget_div = this.widget_divs[index];

        container_div.innerHTML = "";
        container_div.append(widget_div);


        div.innerHTML = "";
        div.append(button_bar);
        div.append(container_div);
    }
}
