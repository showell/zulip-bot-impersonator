import type { Message } from "../backend/db_types";
import type { ZulipEvent } from "../backend/event";

import type { PluginHelper } from "../plugin_helper";

import { MessageList } from "../message_list";

export class CodeSearch {
    div: HTMLDivElement;
    plugin_helper?: PluginHelper;

    constructor() {
        const div = document.createElement("div");
        div.style.maxHeight = "90vh";
        div.style.overflow = "auto";
        this.div = div;
    }

    start(plugin_helper: PluginHelper): void {
        this.plugin_helper = plugin_helper;
        plugin_helper.update_label("Code Search");
        this.load_messages();
    }

    load_messages(): void {
        const div = this.div;

        const filter = {
            predicate(message: Message) {
                return message.code_snippets.length > 0;
            },
        };

        const message_list = new MessageList(filter, 1000);

        div.append(message_list.div);
    }

    handle_event(_event: ZulipEvent): void {}
}
