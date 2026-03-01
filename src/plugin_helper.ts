import type { Stream } from "./backend/db_types";

import { ZulipEvent } from "./backend/event";
import * as backend_model from "./backend/model";

import type { Page } from "./page";

import * as page_widget from "./dom/page_widget";
import { TabButton } from "./tab_button";

export type Plugin = {
    div: HTMLDivElement;
    start: (plugin_helper: PluginHelper) => void;
    handle_event: (event: ZulipEvent) => void;
};

export class PluginHelper {
    div: HTMLDivElement;
    deleted: boolean;
    page: Page;
    open: boolean;
    plugin: Plugin;
    label: string;
    tab_button: TabButton;

    constructor(plugin: Plugin, page: Page) {
        const div = document.createElement("div");
        this.plugin = plugin;
        this.page = page;
        this.deleted = false;
        this.open = false;
        this.label = "plugin";
        this.tab_button = new TabButton(this, page);

        div.append(plugin.div);
        this.div = div;
    }

    delete_me(): void {
        this.deleted = true;
        this.page.remove_deleted_plugins();
        this.page.go_to_top();
    }

    redraw_tab_button() {
        this.tab_button.refresh();
    }

    update_label(label: string) {
        this.label = label;
        this.redraw_tab_button();
    }

    violet() {
        this.tab_button.violet();
    }
}
