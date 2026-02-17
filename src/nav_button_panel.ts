import { Button } from "./button";
import type { SearchWidget } from "./search_widget";

export class ButtonPanel {
    div: HTMLElement;
    surf_channels: Button;
    prev_channel: Button;
    next_channel: Button;
    add_topic: Button;
    surf_topics: Button;
    prev_topic: Button;
    next_topic: Button;

    constructor(search_widget: SearchWidget) {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.paddingBottom = "4px";

        this.surf_channels = new Button("surf channels", () => {
            search_widget.surf_channels();
        });

        this.next_channel = new Button("next channel", () => {
            search_widget.stream_down();
        });
        this.prev_channel = new Button("prev channel", () => {
            search_widget.stream_up();
        });

        this.add_topic = new Button("add topic", () => {
            search_widget.add_topic();
        });

        this.surf_topics = new Button("surf topics", () => {
            search_widget.surf_topics();
        });

        this.next_topic = new Button("next topic", () => {
            search_widget.topic_down();
        });
        this.prev_topic = new Button("prev topic", () => {
            search_widget.topic_up();
        });

        div.append(this.surf_channels.div);
        div.append(this.prev_channel.div);
        div.append(this.next_channel.div);

        div.append(this.add_topic.div);

        div.append(this.surf_topics.div);
        div.append(this.prev_topic.div);
        div.append(this.next_topic.div);

        this.div = div;
    }

    update(info: {
        stream_selected: boolean;
        topic_selected: boolean;
        channels_hidden: boolean;
    }): void {
        const { stream_selected, topic_selected, channels_hidden } = info;

        function show_if(button: Button, cond: boolean): void {
            if (cond) {
                button.show();
            } else {
                button.hide();
            }
        }

        show_if(this.surf_channels, !stream_selected || channels_hidden);

        show_if(this.next_channel, !topic_selected && stream_selected);
        show_if(this.prev_channel, !topic_selected && stream_selected);

        show_if(this.add_topic, stream_selected);
        show_if(this.surf_topics, stream_selected && !topic_selected);

        show_if(this.next_topic, topic_selected);
        show_if(this.prev_topic, topic_selected);
    }

    focus_next_channel_button(): void {
        this.next_channel.focus();
    }

    focus_next_topic_button(): void {
        this.next_topic.focus();
    }

    focus_surf_topics_button(): void {
        this.surf_topics.focus();
    }

    start(): void {
        this.surf_channels.focus();
    }
}
