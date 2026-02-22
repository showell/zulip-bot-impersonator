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

        button.style.borderBottom = "none";
        button.style.fontSize = "16px";
        button.style.paddingLeft = "13px";
        button.style.paddingRight = "13px";
        button.style.paddingTop = "4px";
        button.style.paddingBottom = "4px";
        button.style.borderTopRightRadius = "10px";
        button.style.borderTopLeftRadius = "10px";

        this.plugin_helper = plugin_helper;
        this.div = div;
        this.button = button;

        button.addEventListener("click", () => {
            page.open(plugin_helper);
        });

        div.append(button);

        this.refresh();
    }

    refresh(): void {
        const button = this.button;
        const plugin_helper = this.plugin_helper;

        button.innerText = plugin_helper.label;

        if (plugin_helper.open) {
            button.style.backgroundColor = "white";
            button.style.borderBottom = "1px white solid";
            button.style.color = "#000080";
        } else {
            button.style.backgroundColor = "lightgray";
            button.style.borderBottom = "1px black solid";
            button.style.color = "#0000B0";
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

    add_plugin(plugin: Plugin): void {
        this.page.add_plugin(plugin);
    }
}
