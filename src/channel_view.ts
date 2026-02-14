import { MessageView } from "./message_view";
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
        const topic_list = this.get_topic_list()!;

        const topic = topic_list.get_current_topic();
        const message_view = new MessageView(topic!);

        div.innerHTML = "";
        div.append(this.topic_pane.div);
        div.append(message_view.div);
    }

    get_topic_list(): TopicList | undefined {
        return this.topic_pane.get_topic_list();
    }

    refresh(): void {
        const topic_list = this.get_topic_list()!;
        topic_list.refresh();
    }

    clear_message_view(): void {
        const div = this.div;
        const topic_list = this.get_topic_list()!;

        topic_list.clear_selection();

        const topic = topic_list.get_current_topic();

        div.innerHTML = "";
        div.append(this.topic_pane.div);
    }

    set_topic_index(index: number): void {
        const topic_list = this.get_topic_list()!;

        topic_list.select_index(index);
        this.open_message_view();
    }

    surf_topics(): void {
        const topic_list = this.get_topic_list()!;

        topic_list.surf();
        this.open_message_view();
    }

    topic_up(): void {
        const topic_list = this.get_topic_list()!;

        topic_list.up();
        this.open_message_view();
    }

    topic_down(): void {
        const topic_list = this.get_topic_list()!;

        topic_list.down();
        this.open_message_view();
    }
}
