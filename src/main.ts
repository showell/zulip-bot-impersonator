import { EventHandler, ZulipEvent } from "./backend/event";
import * as model from "./backend/model";
import * as zulip_client from "./backend/zulip_client";

import { config } from "./secrets";

import { EventRadio } from "./plugins/event_radio";
import { Page } from "./page";

export async function run() {
    document.title = config.nickname;

    document.body.style.backgroundColor = "rgb(246, 246, 255)";

    // do before fetching to get "spinner"
    const page = new Page();
    document.body.append(page.div);

    const event_radio_widget = new EventRadio();

    function handle_event(event: ZulipEvent) {
        model.handle_event(event);
        page.handle_event(event);
    }

    const event_manager = new EventHandler(handle_event);

    // we wait for register to finish, but then polling goes
    // on "forever" asynchronously
    await zulip_client.register_queue();

    await model.fetch_model_data();

    zulip_client.start_polling(event_manager);

    page.add_plugin(event_radio_widget);

    page.add_search_widget();
}

run();
