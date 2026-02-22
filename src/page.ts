import type { ZulipEvent } from "./backend/event";
import type { Plugin } from "./plugin_helper";

import { EventFlavor } from "./backend/event";
import * as model from './backend/model'
import { MessageRow } from "./row_types";
import { PluginChooser } from "./plugins/plugin_chooser";
import { PluginHelper } from "./plugin_helper";
import { SearchWidget } from "./search_widget";
import { StatusBar, create_global_status_bar } from "./status_bar";

export class Page {
    div: HTMLElement;
    plugin_helpers: PluginHelper[];

    constructor() {
        const div = document.body;
        div.style.margin = "0"
        div.style.backgroundColor = "rgb(246, 246, 255)"
        create_global_status_bar();

        div.append(StatusBar.div);
        StatusBar.inform(
            "Welcome to Zulip! loading users and recent messages...",
        );

        this.plugin_helpers = [];
        this.div = div;
    }

    start(): void {
        const plugin_chooser = new PluginChooser();
        this.add_plugin(plugin_chooser);

        this.add_search_widget();
        document.title = `(${model.get_total_unread_count()}) Le Big Mac`
    }

    make_button_bar(): HTMLElement {
        this.plugin_helpers = this.plugin_helpers.filter((plugin_helper) => {
            return !plugin_helper.deleted;
        });

        const plugin_helpers = this.plugin_helpers;

        const button_bar = document.createElement("div");
        button_bar.style.display = "flex";
        button_bar.style.alignItems = "flex-end";
        button_bar.style.paddingTop = "2px";
        button_bar.style.marginBottom = "3px";
        button_bar.style.maxHeight = "fit-content";

        const add_search_button = this.add_search_button();
        button_bar.append(add_search_button);

        for (const plugin_helper of plugin_helpers) {
            button_bar.append(plugin_helper.button.div);
        }

        const spacer = document.createElement("div");
        spacer.innerText = " ";
        spacer.style.borderBottom = "1px black solid";
        spacer.style.height = "1px";
        spacer.style.flexGrow = "1";
        button_bar.append(spacer);


        return button_bar;
    }

    render_navbar() {
        const navbar_div = document.createElement("div");
        navbar_div.append(StatusBar.div);
        navbar_div.append(this.make_button_bar());
        navbar_div.style.position = "sticky"
        navbar_div.style.top = "0px";
        navbar_div.style.zIndex = "100"
        navbar_div.style.backgroundColor = "rgb(246, 246, 255)"

        return navbar_div
    }

    add_search_button(): HTMLElement {
        const self = this;

        const div = document.createElement("div");
        div.style.marginRight = "15px";

        const button = document.createElement("button");
        button.innerText = "+";
        button.style.backgroundColor = "white";
        button.style.padding = "3px";
        button.style.fontSize = "12px";
        button.style.backgroundColor = "white";
        button.style.border = "1px green solid";

        button.addEventListener("click", () => {
            self.add_search_widget();
        });

        div.append(button);

        return div;
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
        const container_div = document.createElement("div");
        container_div.style.overflowY = "auto";

        const navbar = this.render_navbar();

        container_div.innerHTML = "";
        container_div.append(plugin_helper.plugin.div);

        div.innerHTML = "";
        div.append(navbar)
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
            StatusBar.inform(
                `Message arrived from ${sender_name} at ${address}.`,
            );
        }

        if (event.flavor === EventFlavor.MARK_AS_READ) {
            StatusBar.celebrate("Messages have been marked as read.");
        }

        for (const plugin_helper of this.plugin_helpers) {
            plugin_helper.plugin.handle_event(event);
        }

        document.title = `(${model.get_total_unread_count()}) Le Big Mac`
    }
}
