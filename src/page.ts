type TabInfo = {
    open: boolean;
    widget_div: HTMLElement;
}

class Button {
    div: HTMLElement;

    constructor(tab_info: TabInfo, page: Page) {
        const div = document.createElement("div");
        const button = document.createElement("button");
        button.innerText = `some tab`;

        if (tab_info.open) {
            button.style.backgroundColor = "lightgreen";
        }

        button.addEventListener("click", () => {
            page.open(tab_info);
        });

        div.append(button);

        this.div = div;
    }
}


export class Page {
    div: HTMLElement;
    container_div: HTMLElement;
    tab_infos: TabInfo[];

    constructor() {
        const div = document.createElement("div");
        div.innerText =
            "Welcome to Zulip! loading users and recent messages...";

        this.tab_infos = [];

        const container_div = document.createElement("div");

        this.container_div = container_div;
        this.div = div;
    }

    make_button_bar(): HTMLElement {
        const page = this;
        const tab_infos = this.tab_infos;

        const button_bar = document.createElement("div");
        button_bar.style.display = "flex";
        button_bar.style.marginBottom = "5px";

        for (const tab_info of tab_infos) {
            const button = new Button(tab_info, page);
            button_bar.append(button.div);
        }

        return button_bar;
    }


    add_widget(widget_div: HTMLElement): void {
        const tab_infos = this.tab_infos;

        const open = false;
        const tab_info = { widget_div, open }

        tab_infos.push(tab_info);

        this.open(tab_info);
    }

    close_all(): void {
        for (const tab_info of this.tab_infos) {
            tab_info.open = false;
        }
    }

    open(tab_info: TabInfo): void {
        const div = this.div;
        const container_div = this.container_div;


        this.close_all();
        tab_info.open = true;

        const button_bar = this.make_button_bar();

        container_div.innerHTML = "";
        container_div.append(tab_info.widget_div);

        div.innerHTML = "";
        div.append(button_bar);
        div.append(container_div);
    }
}
