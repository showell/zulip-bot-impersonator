import { EventHandler, ZulipEvent } from "./backend/event";
import * as model from "./backend/model";
import * as zulip_client from "./backend/zulip_client";

import { config } from "./secrets";

import { Page } from "./page";

export async function run() {
    // We overwrite this as soon as we fetch data
    // and call page.start(), which in turn calls
    // into SearchWidget to get the unread counts
    // for our initial download of Zulip data.  But
    // this is nice to have while data is still loading.
    document.title = config.nickname;

    // do before fetching to get "spinner"
    const page = new Page();

    function handle_event(event: ZulipEvent) {
        // We want the model to update before any plugins touch
        // the event.
        model.handle_event(event);

        // The Page object dispatches events to all the plugins.
        page.handle_event(event);
    }

    const event_manager = new EventHandler(handle_event);

    // we wait for register to finish, but then polling goes
    // on "forever" asynchronously
    await zulip_client.register_queue();

    await model.fetch_model_data();

    zulip_client.start_polling(event_manager);

    page.start();
}

run();
