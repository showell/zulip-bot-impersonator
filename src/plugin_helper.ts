import { ZulipEvent } from "./backend/event";

import type { Page } from "./page";

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
        this.tab_button.div.remove();
        this.div.remove();
        this.deleted = true;
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
