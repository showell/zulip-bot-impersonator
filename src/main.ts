import { EventFlavor, EventHandler, ZulipEvent } from "./backend/event";
import * as model from "./backend/model";
import * as zulip_client from "./backend/zulip_client";

import { config } from "./secrets";

import { EventRadioWidgetSingleton } from "./event_radio";
import { Page } from "./page";
import { SearchWidget } from "./search_widget";

export async function run() {
    document.title = config.nickname;

    document.body.style.backgroundColor = "rgb(246, 246, 255)";

    // do before fetching to get "spinner"
    const page = new Page();
    document.body.append(page.div);


    const event_radio_widget = new EventRadioWidgetSingleton();

    const search_widgets: SearchWidget[] = [];

    function handle_event(event: ZulipEvent) {
        event_radio_widget.add_event(event);

        if (event.flavor === EventFlavor.STREAM_MESSAGE) {
            model.add_stream_messages_to_cache(event.stream_message);

            for (const search_widget of search_widgets) {
                search_widget.refresh(event.stream_message);
            }
        }

        if (event.flavor === EventFlavor.UNREAD_ADD) {
            const message_ids = event.message_ids;

            model.mark_message_ids_as_read(message_ids);

            for (const search_widget of search_widgets) {
                search_widget.refresh_unread(message_ids);
            }
        }
    }

    const event_manager = new EventHandler(handle_event);

    // we wait for register to finish, but then polling goes
    // on "forever" asynchronously
    await zulip_client.register_queue();

    await model.fetch_model_data();

    zulip_client.start_polling(event_manager);

    for (let i = 0; i < 3; ++i) {
        const search_widget = new SearchWidget();
        search_widget.populate();
        page.add_widget(search_widget);
        search_widgets.push(search_widget);
    }

    page.div.append(event_radio_widget.div);
}

run();
