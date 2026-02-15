import { MessageView } from "./message_view";
import * as model from "./model";
import { TopicList } from "./topic_list";
import { TopicPane } from "./topic_pane";

type CallbackType = {
    clear_message_view(): void;
    set_topic_index(index: number): void;
};

export class ChannelView {
    div: HTMLElement;
    stream_id: number;
    topic_pane: TopicPane;
    message_view?: MessageView;

    constructor(stream_id: number, callbacks: CallbackType) {
        this.stream_id = stream_id;

        this.topic_pane = new TopicPane(stream_id, {
            clear_message_view(): void {
                callbacks.clear_message_view();
            },
            set_topic_index(index: number): void {
                callbacks.set_topic_index(index);
            },
        });

        const div = document.createElement("div");
        div.style.display = "flex";

        div.append(this.topic_pane.div);

        this.div = div;
    }

    topic_selected(): boolean {
        return this.topic_pane.topic_selected();
    }

    open_message_view(): void {
        const div = this.div;
        const topic_list = this.get_topic_list();

        const topic = topic_list.get_current_topic();
        const message_view = new MessageView(topic!);

        div.innerHTML = "";
        div.append(this.topic_pane.div);
        div.append(message_view.div);

        this.message_view = message_view;
    }

    get_topic_list(): TopicList {
        return this.topic_pane.get_topic_list();
    }

    refresh(raw_stream_message: model.RawStreamMessage): void {
        if (raw_stream_message.stream_id === this.stream_id) {
            const topic_list = this.get_topic_list();
            topic_list.refresh();

            if (this.message_view) {
                this.message_view.refresh(raw_stream_message);
            }
        }
    }

    clear_message_view(): void {
        const div = this.div;
        const topic_list = this.get_topic_list();

        topic_list.clear_selection();

        const topic = topic_list.get_current_topic();

        div.innerHTML = "";
        div.append(this.topic_pane.div);
    }

    set_topic_index(index: number): void {
        const topic_list = this.get_topic_list();

        topic_list.select_index(index);
        this.open_message_view();
    }

    surf_topics(): void {
        const topic_list = this.get_topic_list();

        topic_list.surf();
        this.open_message_view();
    }

    topic_up(): void {
        const topic_list = this.get_topic_list();

        topic_list.up();
        this.open_message_view();
    }

    topic_down(): void {
        const topic_list = this.get_topic_list();

        topic_list.down();
        this.open_message_view();
    }
}
