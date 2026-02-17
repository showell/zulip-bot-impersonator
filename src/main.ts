import { EventFlavor, EventHandler, ZulipEvent } from "./backend/event";
import * as model from "./backend/model";
import * as zulip_client from "./backend/zulip_client";

import { config } from "./secrets";

import { EventRadioWidgetSingleton } from "./event_radio";
import { SearchWidget } from "./search_widget";

class Page {
    div: HTMLElement;

    constructor() {
        const div = document.createElement("div");
        div.innerText =
            "Welcome to Zulip! loading users and recent messages...";

        document.body.append(div);

        this.div = div;
    }

    populate(inner_div: HTMLElement) {
        this.div.innerHTML = "";
        this.div.append(inner_div);
    }
}

export async function run() {
    document.title = config.nickname;

    document.body.style.backgroundColor = "rgb(246, 246, 255)";

    // do before fetching to get "spinner"
    const page = new Page();

    const event_radio_widget = new EventRadioWidgetSingleton();

    let ready = false;

    function handle_event(event: ZulipEvent) {
        event_radio_widget.add_event(event);

        if (event.flavor === EventFlavor.STREAM_MESSAGE) {
            model.add_stream_messages_to_cache(event.stream_message);

            if (ready) {
                search_widget.refresh(event.stream_message);
            } else {
                console.log("we were told to refresh before finishing fetch");
            }
        }

        if (event.flavor === EventFlavor.UNREAD_ADD) {
            const message_ids = event.message_ids;

            model.mark_message_ids_as_read(message_ids);

            if (ready) {
                search_widget.refresh_unread(message_ids);
            } else {
                console.log("we were told to refresh before finishing fetch");
            }
        }
    }

    const event_manager = new EventHandler(handle_event);

    // we wait for register to finish, but then polling goes
    // on "forever" asynchronously
    await zulip_client.register_queue();

    await model.fetch_model_data();

    zulip_client.start_polling(event_manager);

    const search_widget = new SearchWidget();
    search_widget.populate();
    page.populate(search_widget.div);
    search_widget.start();

    ready = true;

    page.div.append(event_radio_widget.div);
}

run();
