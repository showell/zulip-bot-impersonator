import type { ZulipEvent } from "../backend/event";
import type { Plugin, PluginHelper } from "../plugin_helper";

import { APP } from "../app";

import { CodeSearch } from "./code_search";
import { EventRadio } from "./event_radio";

export class PluginChooser {
    div: HTMLDivElement;

    constructor() {
        const div = document.createElement("div");
        this.div = div;
    }

    start(plugin_helper: PluginHelper): void {
        const div = this.div;

        div.innerText = "We only have one plugin so far!";

        function add_plugin(name: string, make_plugin: () => Plugin) {
            const button = document.createElement("button");
            button.innerText = `Launch ${name}`;
            button.addEventListener("click", () => {
                APP.add_plugin(make_plugin());
            });
            div.append(button);
        }

        add_plugin("Event Radio", () => new EventRadio());
        add_plugin("Code Search", () => new CodeSearch());

        plugin_helper.update_label("Plugins");
    }

    handle_event(_event: ZulipEvent): void {
        // nothing to do
    }
}
