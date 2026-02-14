import { MessageView } from "./message_view";
import { CurrentTopicList, TopicPane } from "./topic_pane";

type CallbackType = {
    clear_message_view(): void;
    set_topic_index(index: number): void;
};

export class ChannelView {
    div: HTMLElement;
    stream_id: number;
    topic_pane: TopicPane;

    constructor(stream_id: number, callbacks: CallbackType) {
        this.stream_id = stream_id;

        this.topic_pane = new TopicPane({
            clear_message_view(): void {
                callbacks.clear_message_view();
            },
            set_topic_index(index: number): void {
                callbacks.set_topic_index(index);
            },
        });

        const div = document.createElement("div");
        div.style.display = "flex";

        this.topic_pane.populate(stream_id);
        div.append(this.topic_pane.div);

        this.div = div;
    }

    topic_selected(): boolean {
        return this.topic_pane.topic_selected();
    }

    open_message_view(): void {
        const div = this.div;

        const topic = CurrentTopicList.get_current_topic();
        const message_view = new MessageView(topic!);

        div.innerHTML = "";
        div.append(this.topic_pane.div);
        div.append(message_view.div);
    }

    clear_message_view(): void {
        const div = this.div;
        CurrentTopicList.clear_selection();

        const topic = CurrentTopicList.get_current_topic();

        div.innerHTML = "";
        div.append(this.topic_pane.div);
    }

    set_topic_index(index: number): void {
        CurrentTopicList.select_index(index);
        this.open_message_view();
    }

    surf_topics(): void {
        CurrentTopicList.surf();
        this.open_message_view();
    }

    topic_up(): void {
        CurrentTopicList.up();
        this.open_message_view();
    }

    topic_down(): void {
        CurrentTopicList.down();
        this.open_message_view();
    }
}
