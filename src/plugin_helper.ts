import type { Stream } from "./backend/db_types";

import { ZulipEvent } from "./backend/event";
import * as backend_model from "./backend/model";

import type { Page } from "./page";

class Model {
    stream_for(stream_id: number): Stream {
        return backend_model.stream_for(stream_id);
    }
}

export type Plugin = {
    div: HTMLElement;
    start: (plugin_helper: PluginHelper) => void;
    handle_event: (event: ZulipEvent) => void;
};

class Button {
    plugin_helper: PluginHelper;
    button: HTMLElement;
    div: HTMLElement;

    constructor(plugin_helper: PluginHelper, page: Page) {
        const div = document.createElement("div");
        const button = document.createElement("button");

        this.plugin_helper = plugin_helper;
        this.div = div;
        this.button = button;

        button.addEventListener("click", () => {
            page.open(plugin_helper);
        });

        div.style.marginRight = "7px";
        div.append(button);

        this.refresh();
    }

    refresh(): void {
        const button = this.button;
        const plugin_helper = this.plugin_helper;

        button.innerText = plugin_helper.label;

        if (plugin_helper.open) {
            button.style.backgroundColor = "lightgreen";
        } else {
            button.style.backgroundColor = "lightblue";
        }
    }

    violet(): void {
        this.button.style.backgroundColor = "violet";
    }
}

export class PluginHelper {
    deleted: boolean;
    page: Page;
    open: boolean;
    plugin: Plugin;
    label: string;
    button: Button;
    model: Model;

    constructor(plugin: Plugin, page: Page) {
        this.plugin = plugin;
        this.page = page;
        this.deleted = false;
        this.open = false;
        this.label = "plugin";
        this.button = new Button(this, page);
        this.model = new Model();
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
