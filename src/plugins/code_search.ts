import type { Message } from "../backend/db_types";
import type { ZulipEvent } from "../backend/event";

import type { PluginHelper } from "../plugin_helper";

import * as model from "../backend/model";

import { MessageList } from "../message_list";

export class CodeSearch {
    div: HTMLDivElement;
    plugin_helper?: PluginHelper;

    constructor() {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "center";
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

        const messages = model.filtered_messages(filter);
        messages.reverse();

        const message_list = new MessageList({
            messages,
            filter,
            max_width: 750,
            topic_id: undefined,
        });

        div.append(message_list.div);
    }

    handle_event(_event: ZulipEvent): void {}
}
