import type { ZulipEvent } from "./backend/event";
import type { Plugin } from "./plugin_helper";

import { EventFlavor } from "./backend/event";

import { MessageRow } from "./row_types";
import { PluginHelper } from "./plugin_helper";
import { SearchWidget } from "./search_widget";
import { StatusBar, create_global_status_bar } from "./status_bar";

export class Page {
    div: HTMLElement;
    container_div: HTMLElement;
    plugin_helpers: PluginHelper[];

    constructor() {
        const div = document.createElement("div");
        create_global_status_bar();

        div.append(StatusBar.div);
        StatusBar.inform(
            "Welcome to Zulip! loading users and recent messages...",
        );

        this.plugin_helpers = [];

        const container_div = document.createElement("div");

        this.container_div = container_div;
        this.div = div;
    }

    make_button_bar(): HTMLElement {
        this.plugin_helpers = this.plugin_helpers.filter((plugin_helper) => {
            return !plugin_helper.deleted;
        });

        const plugin_helpers = this.plugin_helpers;

        const button_bar = document.createElement("div");
        button_bar.style.display = "flex";
        button_bar.style.marginBottom = "5px";
        button_bar.style.paddingTop = "2px";
        button_bar.style.paddingBottom = "4px";
        button_bar.style.borderBottom = "1px black solid";

        const add_search_button = this.add_search_button();
        button_bar.append(add_search_button);

        for (const plugin_helper of plugin_helpers) {
            button_bar.append(plugin_helper.button.div);
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

    add_plugin(plugin: Plugin): void {
        const page = this;
        const plugin_helpers = this.plugin_helpers;

        const plugin_helper = new PluginHelper(plugin, page);

        plugin_helpers.push(plugin_helper);

        this.open(plugin_helper);
        plugin.start(plugin_helper);
    }

    close_all(): void {
        for (const plugin_helper of this.plugin_helpers) {
            if (plugin_helper.open) {
                plugin_helper.open = false;
                plugin_helper.refresh();
            }
        }
    }

    open(plugin_helper: PluginHelper): void {
        this.close_all();
        plugin_helper.open = true;
        plugin_helper.refresh();
        this.redraw(plugin_helper);
    }

    go_to_top(): void {
        this.redraw(this.plugin_helpers[0]);
    }

    redraw(plugin_helper: PluginHelper): void {
        const div = this.div;
        const container_div = this.container_div;

        const button_bar = this.make_button_bar();

        container_div.innerHTML = "";
        container_div.append(plugin_helper.plugin.div);

        div.innerHTML = "";
        div.append(StatusBar.div);
        div.append(button_bar);
        div.append(container_div);
    }

    add_search_widget(): void {
        const search_widget = new SearchWidget();
        search_widget.populate();
        this.add_plugin(search_widget);
    }

    handle_event(event: ZulipEvent): void {
        if (event.flavor === EventFlavor.STREAM_MESSAGE) {
            const message_row = new MessageRow(event.stream_message);
            const sender_name = message_row.sender_name();
            const address = message_row.address_string();
            StatusBar.inform(`Message arrived from ${sender_name} at ${address}.`);
        }

        if (event.flavor === EventFlavor.UNREAD_ADD) {
            StatusBar.celebrate("Messages have been marked as read.");
        }

        for (const plugin_helper of this.plugin_helpers) {
            plugin_helper.plugin.handle_event(event);
        }
    }
}
