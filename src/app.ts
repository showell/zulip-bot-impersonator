// See main.ts for the main entry point.

import type { Address } from "./address";
import type { Page } from "./page.ts";

class Application {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    add_search_widget(address: Address) {
        this.page!.add_search_widget(address);
    }
}

export let APP: Application;

export function init(page: Page) {
    APP = new Application(page);
}
