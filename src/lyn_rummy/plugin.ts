import type { ZulipEvent } from "../backend/event";
import type { PluginHelper } from "../plugin_helper";

import * as lyn_rummy from "./game";

export function plugin(plugin_helper: PluginHelper) {
    const div = document.createElement("div");

    const my_deck_cards = lyn_rummy.build_full_double_deck();

    const json = JSON.stringify(my_deck_cards, null, 2);
    const json_cards = JSON.parse(json) as lyn_rummy.JsonCard[];
    const deck_cards: lyn_rummy.Card[] = json_cards.map((json_card) => {
        return lyn_rummy.Card.from_json(json_card);
    });

    lyn_rummy.run_game_code(deck_cards, div);

    const max_height = document.documentElement.clientHeight - 60;
    div.style.maxHeight = `${max_height}px`;

    plugin_helper.update_label(lyn_rummy.get_title());

    function handle_event(_event: ZulipEvent) {}

    return {
        div,
        handle_event,
    };
}
