import { EventFlavor, EventHandler, ZulipEvent } from "./event";
import { EventRadioWidgetSingleton } from "./event_radio";
import * as model from "./model";
import { config } from "./secrets";
import { SearchWidget } from "./search_widget";
import * as zulip_client from "./zulip_client";

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

    const event_manager = new EventHandler((event: ZulipEvent) => {
        event_radio_widget.add_event(event);

        if (event.flavor === EventFlavor.STREAM_MESSAGE) {
            model.add_stream_messages_to_cache(event.raw_stream_message);

            if (ready) {
                search_widget.refresh(event.raw_stream_message);
            } else {
                console.log("we were told to refresh before finishing fetch");
            }
        }
    });

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
