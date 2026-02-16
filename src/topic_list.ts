import type { Topic } from "./db_types";
import type { CallbackType } from "./topic_row";

import { Cursor } from "./cursor";
import * as model from "./model";
import { render_thead, render_th, render_big_list } from "./render";
import { TopicRow } from "./topic_row";

export class TopicList {
    div: HTMLElement;
    topics: Topic[];
    cursor: Cursor;
    stream_id: number;
    callbacks: CallbackType;

    constructor(stream_id: number, callbacks: CallbackType) {
        this.callbacks = callbacks;

        const div = render_big_list();

        this.stream_id = stream_id;

        this.topics = [];
        this.cursor = new Cursor();

        this.div = div;
    }

    has_selection(): boolean {
        return this.cursor.has_selection();
    }

    get_current_topic(): Topic | undefined {
        const index = this.cursor.selected_index;

        if (index === undefined) return undefined;

        return this.topics[index];
    }

    refresh_topics_with_topic_name_selected(topic_name: string): void {
        const new_topics = this.get_topics();
        const cursor = this.cursor;

        const index = new_topics.findIndex((topic) => {
            return topic.name === topic_name;
        });
        cursor.select_index(index);

        this.populate_from_topics(new_topics);
    }

    refresh(): void {
        const topic = this.get_current_topic();
        const cursor = this.cursor;

        const new_topics = this.get_topics();

        if (topic) {
            const new_index = new_topics.findIndex((other) =>
                topic.is_same(other),
            );
            cursor.select_index(new_index);
        }

        this.populate_from_topics(new_topics);
    }

    make_thead(): HTMLElement {
        const thead = render_thead([
            render_th("Msgs"),
            render_th("Unread"),
            render_th("Topic name"),
        ]);

        return thead;
    }

    get_topics(): Topic[] {
        const stream_id = this.stream_id!;
        const cursor = this.cursor;

        const topics = model.get_topics(stream_id);

        topics.sort((t1, t2) => t2.last_msg_id - t1.last_msg_id);
        // topics.sort((t1, t2) => t1.name.localeCompare(t2.name));

        cursor.set_count(topics.length);

        this.topics = topics;

        return topics;
    }

    make_tbody(topics: Topic[]): HTMLElement {
        const callbacks = this.callbacks;
        const cursor = this.cursor;

        const tbody = document.createElement("tbody");

        for (let i = 0; i < topics.length; ++i) {
            const topic = topics[i];
            const selected = cursor.is_selecting(i);
            const topic_row = new TopicRow(topic, i, selected, callbacks);
            tbody.append(topic_row.tr);
        }

        return tbody;
    }

    make_table(topics: Topic[]): HTMLElement {
        const thead = this.make_thead();
        const tbody = this.make_tbody(topics);

        const table = document.createElement("table");
        table.append(thead);
        table.append(tbody);

        table.style.borderCollapse = "collapse";

        return table;
    }

    populate_from_topics(topics: Topic[]) {
        const div = this.div;

        div.innerHTML = "";
        div.append(this.make_table(topics));
    }

    populate() {
        const topics = this.get_topics();
        this.populate_from_topics(topics);
    }

    select_index(index: number) {
        this.cursor.select_index(index);
        this.populate();
    }

    clear_selection(): void {
        this.cursor.clear();
        this.populate();
    }

    surf(): void {
        this.cursor.first();
        this.populate();
    }

    down(): void {
        this.cursor.down();
        this.populate();
    }

    up(): void {
        this.cursor.up();
        this.populate();
    }
}
