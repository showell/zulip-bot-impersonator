import * as model from "./backend/model";

import type { ChannelRow, TopicRow } from "./row_types";
import type { SearchWidget } from "./search_widget";

import { Cursor } from "./cursor";
import { render_big_list } from "./render";
import { TableWidget } from "./table_widget";
import { TopicRowWidget } from "./topic_row_widget";

export class TopicList {
    div: HTMLElement;
    topic_rows: TopicRow[];
    cursor: Cursor;
    stream_id: number;
    search_widget: SearchWidget;

    constructor(channel_row: ChannelRow, search_widget: SearchWidget) {
        this.search_widget = search_widget;

        const div = render_big_list();

        this.stream_id = channel_row.stream_id();

        this.topic_rows = [];
        this.cursor = new Cursor();

        this.div = div;
    }

    has_selection(): boolean {
        return this.cursor.has_selection();
    }

    get_topic_row(): TopicRow | undefined {
        const index = this.cursor.selected_index;

        if (index === undefined) return undefined;

        return this.topic_rows[index];
    }

    get_topic_id(): number | undefined {
        const topic_row = this.get_topic_row();

        if (topic_row === undefined) return undefined;

        return topic_row.topic_id();
    }

    select_topic(new_topic_rows: TopicRow[], topic_id: number) {
        const cursor = this.cursor;

        const index = new_topic_rows.findIndex((topic_row) => {
            return topic_row.topic_id() === topic_id;
        });
        cursor.select_index(index);
    }

    refresh_topics_with_topic_selected(topic_id: number): void {
        const new_topic_rows = this.get_topic_rows();
        this.select_topic(new_topic_rows, topic_id);
        this.populate_from_topic_rows(new_topic_rows);
    }

    get_topic_name(): string | undefined {
        const current_topic_row = this.get_topic_row();
        if (current_topic_row === undefined) {
            return undefined;
        }
        return current_topic_row.name();
    }

    refresh(): void {
        const topic_id = this.get_topic_id();
        const new_topic_rows = this.get_topic_rows();

        if (topic_id) {
            this.select_topic(new_topic_rows, topic_id);
        }

        this.populate_from_topic_rows(new_topic_rows);
    }

    get_topic_rows(): TopicRow[] {
        const stream_id = this.stream_id!;
        const cursor = this.cursor;

        const topic_rows = model.get_topic_rows(stream_id);

        topic_rows.sort((t1, t2) => t2.last_msg_id() - t1.last_msg_id());
        // topics.sort((t1, t2) => t1.name.localeCompare(t2.name));

        cursor.set_count(topic_rows.length);

        this.topic_rows = topic_rows;

        return topic_rows;
    }

    make_table(topic_rows: TopicRow[]): HTMLTableElement {
        const search_widget = this.search_widget;
        const cursor = this.cursor;

        const row_widgets = [];

        for (let i = 0; i < topic_rows.length; ++i) {
            const topic_row = topic_rows[i];
            const selected = cursor.is_selecting(i);
            const topic_row_data = {
                name: topic_row.name(),
                msg_count: topic_row.num_messages(),
                unread_count: topic_row.unread_count(),
            };
            const topic_row_widget = new TopicRowWidget(
                topic_row_data,
                i,
                selected,
                search_widget,
            );
            row_widgets.push(topic_row_widget);
        }

        const columns = ["Unread", "Topic name", "Messages"];
        const table_widget = new TableWidget(columns, row_widgets);

        return table_widget.table;
    }

    populate_from_topic_rows(topic_rows: TopicRow[]) {
        const div = this.div;

        div.innerHTML = "";
        div.append(this.make_table(topic_rows));
    }

    populate() {
        const topic_rows = this.get_topic_rows();
        this.populate_from_topic_rows(topic_rows);
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
