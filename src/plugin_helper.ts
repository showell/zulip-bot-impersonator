import type { Stream } from "./backend/db_types";

import { ZulipEvent } from "./backend/event";
import * as backend_model from "./backend/model";

import type { Page } from "./page";

import * as page_widget from "./dom/page_widget";

class Model {
    stream_for(stream_id: number): Stream {
        return backend_model.stream_for(stream_id);
    }
}

export type Plugin = {
    div: HTMLDivElement;
    start: (plugin_helper: PluginHelper) => void;
    handle_event: (event: ZulipEvent) => void;
};

class TabButton {
    plugin_helper: PluginHelper;
    tab_button: HTMLElement;
    div: HTMLDivElement;

    constructor(plugin_helper: PluginHelper, page: Page) {
        const div = document.createElement("div");

        const tab_button = page_widget.navbar_tab_button();

        this.plugin_helper = plugin_helper;
        this.div = div;
        this.tab_button = tab_button;

        tab_button.addEventListener("click", () => {
            page.open(plugin_helper);
        });

        div.append(tab_button);

        this.refresh();
    }

    refresh(): void {
        const tab_button = this.tab_button;
        const plugin_helper = this.plugin_helper;

        tab_button.innerText = plugin_helper.label;

        if (plugin_helper.open) {
            tab_button.style.backgroundColor = "white";
            tab_button.style.borderBottom = "1px white solid";
            tab_button.style.color = "#000080";
        } else {
            tab_button.style.backgroundColor = "lightgray";
            tab_button.style.borderBottom = "1px black solid";
            tab_button.style.color = "#0000B0";
        }
    }

    violet(): void {
        this.tab_button.style.backgroundColor = "violet";
    }
}

export class PluginHelper {
    deleted: boolean;
    page: Page;
    open: boolean;
    plugin: Plugin;
    label: string;
    tab_button: TabButton;
    model: Model;

    constructor(plugin: Plugin, page: Page) {
        this.plugin = plugin;
        this.page = page;
        this.deleted = false;
        this.open = false;
        this.label = "plugin";
        this.tab_button = new TabButton(this, page);
        this.model = new Model();
    }

    delete_me(): void {
        this.deleted = true;
        this.page.remove_deleted_plugins();
        this.page.go_to_top();
    }

    refresh() {
        this.tab_button.refresh();
    }

    update_label(label: string) {
        this.label = label;
        this.refresh();
    }

    violet() {
        this.tab_button.violet();
    }

    add_plugin(plugin: Plugin): void {
        this.page.add_plugin(plugin);
    }
}
