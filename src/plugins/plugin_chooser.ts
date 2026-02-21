import type { ZulipEvent } from "../backend/event";
import type { PluginHelper } from "../plugin_helper";

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

        const button = document.createElement("button");
        button.innerText = "Launch event radio";
        button.addEventListener("click", () => {
            const event_radio = new EventRadio();
            plugin_helper.add_plugin(event_radio);
        });

        div.append(button);

        plugin_helper.update_label("Plugins");
    }

    handle_event(_event: ZulipEvent): void {
        // nothing to do
    }
}
