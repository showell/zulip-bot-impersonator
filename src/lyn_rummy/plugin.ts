import * as game from "./game";

import type { ZulipEvent } from "../backend/event";
import type { PluginHelper } from "../plugin_helper";

export function plugin(plugin_helper: PluginHelper) {
    const div = document.createElement("div");
    game.run_game_code(div);

    // const max_height = document.documentElement.clientHeight - 60;
    const max_height = 300;
    div.style.maxHeight = `${max_height}px`;

    plugin_helper.update_label(game.get_title());

    function handle_event(_event: ZulipEvent) {}

    return {
        div,
        handle_event,
    };
}
