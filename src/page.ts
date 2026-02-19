import { ZulipEvent } from "./backend/event";

import { SearchWidget } from "./search_widget";

type Widget = {
    div: HTMLElement;
    start: (tab_helper: TabHelper) => void;
    handle_event: (event: ZulipEvent) => void;
};

class Button {
    tab_helper: TabHelper;
    button: HTMLElement;
    div: HTMLElement;

    constructor(tab_helper: TabHelper, page: Page) {
        const div = document.createElement("div");
        const button = document.createElement("button");

        this.tab_helper = tab_helper;
        this.div = div;
        this.button = button;

        button.addEventListener("click", () => {
            page.open(tab_helper);
        });

        div.style.marginRight = "7px";
        div.append(button);

        this.refresh();
    }

    refresh(): void {
        const button = this.button;
        const tab_helper = this.tab_helper;

        button.innerText = tab_helper.label;

        if (tab_helper.open) {
            button.style.backgroundColor = "lightgreen";
        } else {
            button.style.backgroundColor = "lightblue";
        }
    }

    violet(): void {
        this.button.style.backgroundColor = "violet";
    }
}

export class TabHelper {
    deleted: boolean;
    page: Page;
    open: boolean;
    widget: Widget;
    label: string;
    button: Button;

    constructor(widget: Widget, page: Page) {
        this.widget = widget;
        this.page = page;
        this.deleted = false;
        this.open = false;
        this.label = "widget";
        this.button = new Button(this, page);
    }

    delete_me(): void {
        this.deleted = true;
        this.page.go_to_top();
    }

    refresh() {
        this.button.refresh();
    }

    update_label(label: string) {
        this.label = label;
        this.refresh();
    }

    violet() {
        this.button.violet();
    }
}

export class Page {
    div: HTMLElement;
    container_div: HTMLElement;
    tab_helpers: TabHelper[];

    constructor() {
        const div = document.createElement("div");
        div.innerText =
            "Welcome to Zulip! loading users and recent messages...";

        this.tab_helpers = [];

        const container_div = document.createElement("div");

        this.container_div = container_div;
        this.div = div;
    }

    make_button_bar(): HTMLElement {
        this.tab_helpers = this.tab_helpers.filter((tab_helper) => {
            return !tab_helper.deleted;
        });

        const tab_helpers = this.tab_helpers;

        const button_bar = document.createElement("div");
        button_bar.style.display = "flex";
        button_bar.style.marginBottom = "5px";

        const add_search_button = this.add_search_button();
        button_bar.append(add_search_button);

        for (const tab_helper of tab_helpers) {
            button_bar.append(tab_helper.button.div);
        }

        return button_bar;
    }

    add_search_button(): HTMLElement {
        const self = this;

        const elem = document.createElement("button");
        elem.style.backgroundColor = "white";
        elem.style.marginRight = "10px";
        elem.innerText = "Add search tab";

        elem.addEventListener("click", () => {
            self.add_search_widget();
        });

        return elem;
    }

    add_widget(widget: Widget): void {
        const page = this;
        const tab_helpers = this.tab_helpers;

        const tab_helper = new TabHelper(widget, page);

        tab_helpers.push(tab_helper);

        widget.start(tab_helper);
        this.open(tab_helper);
    }

    close_all(): void {
        for (const tab_helper of this.tab_helpers) {
            if (tab_helper.open) {
                tab_helper.open = false;
                tab_helper.refresh();
            }
        }
    }

    open(tab_helper: TabHelper): void {
        this.close_all();
        tab_helper.open = true;
        tab_helper.refresh();
        this.redraw(tab_helper);
    }

    go_to_top(): void {
        this.redraw(this.tab_helpers[0]);
    }

    redraw(tab_helper: TabHelper): void {
        const div = this.div;
        const container_div = this.container_div;

        const button_bar = this.make_button_bar();

        container_div.innerHTML = "";
        container_div.append(tab_helper.widget.div);

        div.innerHTML = "";
        div.append(button_bar);
        div.append(container_div);
    }

    add_search_widget(): void {
        const search_widget = new SearchWidget();
        search_widget.populate();
        this.add_widget(search_widget);
    }

    handle_event(event: ZulipEvent): void {
        for (const tab_helper of this.tab_helpers) {
            tab_helper.widget.handle_event(event);
        }
    }
}
