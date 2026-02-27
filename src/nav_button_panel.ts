import { Button } from "./button";
import type { SearchWidget } from "./search_widget";

export class ButtonPanel {
    div: HTMLDivElement;
    close: Button;
    surf_channels: Button;
    prev_channel: Button;
    next_channel: Button;
    add_topic: Button;
    surf_topics: Button;
    prev_topic: Button;
    next_topic: Button;
    mark_topic_read: Button;
    reply: Button;
    fork: Button;

    constructor(search_widget: SearchWidget) {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.maxHeight = "fit-content";
        div.style.marginTop = "4px";
        div.style.marginBottom = "14px";

        this.close = new Button("close", () => {
            search_widget.close();
        });

        this.close.button.style.color = "white";
        this.close.button.style.backgroundColor = "red";

        this.surf_channels = new Button("surf channels", () => {
            search_widget.surf_channels();
        });

        this.next_channel = new Button("next channel", () => {
            search_widget.channel_down();
        });
        this.prev_channel = new Button("prev channel", () => {
            search_widget.channel_up();
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

        this.mark_topic_read = new Button("mark topic read", () => {
            search_widget.mark_topic_read();
        });

        this.reply = new Button("reply", () => {
            search_widget.reply();
        });

        this.fork = new Button("fork", () => {
            search_widget.fork();
            this.fork.set_normal_color();
        });

        div.append(this.close.div);

        div.append(this.surf_channels.div);
        div.append(this.prev_channel.div);
        div.append(this.next_channel.div);

        div.append(this.add_topic.div);

        div.append(this.surf_topics.div);

        div.append(this.prev_topic.div);
        div.append(this.next_topic.div);

        div.append(this.mark_topic_read.div);
        div.append(this.reply.div);

        div.append(this.fork.div);

        this.div = div;
    }

    update(info: { channel_selected: boolean; topic_selected: boolean }): void {
        const { channel_selected, topic_selected } = info;

        function show_if(button: Button, cond: boolean): void {
            if (cond) {
                button.show();
            } else {
                button.hide();
            }
        }

        show_if(this.close, true);

        show_if(this.surf_channels, !channel_selected || topic_selected);

        show_if(this.next_channel, !topic_selected && channel_selected);
        show_if(this.prev_channel, !topic_selected && channel_selected);

        show_if(this.add_topic, channel_selected);

        show_if(this.surf_topics, channel_selected && !topic_selected);

        show_if(this.next_topic, topic_selected);
        show_if(this.prev_topic, topic_selected);

        show_if(this.mark_topic_read, topic_selected);
        show_if(this.reply, topic_selected);

        show_if(this.fork, true);
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
