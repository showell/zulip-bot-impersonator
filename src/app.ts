// See main.ts for the main entry point.

import type { Address } from "./address";
import type { Page } from "./page";
import type { Plugin } from "./plugin_helper";

class Application {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    add_search_widget(address: Address) {
        this.page!.add_search_widget(address);
    }

    add_plugin(plugin: Plugin) {
        this.page!.add_plugin(plugin);
    }
}

export let APP: Application;

export function init(page: Page) {
    APP = new Application(page);
}
