import { EventFlavor, EventHandler, ZulipEvent } from "./backend/event";
import * as model from "./backend/model";
import * as zulip_client from "./backend/zulip_client";

import { config } from "./secrets";

import { EventRadio } from "./event_radio";
import { Page } from "./page";
import { SearchWidget } from "./search_widget";

export async function run() {
    document.title = config.nickname;

    document.body.style.backgroundColor = "rgb(246, 246, 255)";

    // do before fetching to get "spinner"
    const page = new Page();
    document.body.append(page.div);

    const event_radio_widget = new EventRadio();

    const search_widgets: SearchWidget[] = [];

    function handle_event(event: ZulipEvent) {
        if (event.flavor === EventFlavor.STREAM_MESSAGE) {
            model.add_stream_messages_to_cache(event.stream_message);
        }

        if (event.flavor === EventFlavor.UNREAD_ADD) {
            model.mark_message_ids_as_read(event.message_ids);
        }

        page.handle_event(event);
    }

    const event_manager = new EventHandler(handle_event);

    // we wait for register to finish, but then polling goes
    // on "forever" asynchronously
    await zulip_client.register_queue();

    await model.fetch_model_data();

    zulip_client.start_polling(event_manager);

    page.add_widget(event_radio_widget);

    for (let i = 0; i < 3; ++i) {
        const search_widget = new SearchWidget();
        search_widget.populate();
        page.add_widget(search_widget);
        search_widgets.push(search_widget);
    }
}

run();
