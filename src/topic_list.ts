import * as model from "./backend/model";

import type { ChannelRow, TopicRow } from "./row_types";
import type { SearchWidget } from "./search_widget";

import * as table_widget from "./dom/table_widget";
import * as topic_row_widget from "./dom/topic_row_widget";

import { Cursor } from "./cursor";

export class TopicList {
    div: HTMLDivElement;
    topic_rows: TopicRow[];
    cursor: Cursor;
    stream_id: number;
    topic_id?: number;
    search_widget: SearchWidget;

    constructor(channel_row: ChannelRow, search_widget: SearchWidget) {
        this.search_widget = search_widget;

        const div = document.createElement("div");

        this.stream_id = channel_row.stream_id();

        this.topic_rows = [];
        this.cursor = new Cursor();

        this.div = div;
    }

    has_selection(): boolean {
        return this.cursor.has_selection();
    }

    get_topic_id(): number | undefined {
        return this.topic_id;
    }

    select_topic(new_topic_rows: TopicRow[], topic_id: number) {
        const cursor = this.cursor;

        const index = new_topic_rows.findIndex((topic_row) => {
            return topic_row.topic_id() === topic_id;
        });
        cursor.select_index(index);
    }

    refresh_topics_with_topic_selected(topic_id: number): void {
        this.topic_id = topic_id;
        this.populate();
    }

    get_topic_name(): string | undefined {
        const current_topic_row = this.get_topic_row();
        if (current_topic_row === undefined) {
            return undefined;
        }
        return current_topic_row.name();
    }

    get_index_for(topic_id: number): number {
        const topic_rows = this.topic_rows;

        return topic_rows.findIndex((topic_row) => {
            return topic_row.topic_id() === topic_id;
        });
    }

    update_cursor(): void {
        const cursor = this.cursor;
        const topic_rows = this.topic_rows;

        cursor.set_count(topic_rows.length);
        if (this.topic_id === undefined) {
            this.cursor.selected_index = undefined;
        } else {
            this.cursor.selected_index = this.get_index_for(this.topic_id);
        }
    }

    get_topic_row(): TopicRow | undefined {
        const index = this.cursor.selected_index;

        if (index === undefined) return undefined;

        return this.topic_rows[index];
    }

    get_topic_id_from_cursor(): number | undefined {
        const topic_row = this.get_topic_row();

        if (topic_row === undefined) return undefined;

        return topic_row.topic_id();
    }

    refresh(): void {
        this.populate();
    }

    set_topic_id_from_cursor(): void {
        this.topic_id = this.get_topic_id_from_cursor();
    }

    sort_recent(topic_rows: TopicRow[]) {
        topic_rows.sort((topic1, topic2) => {
            return topic2.last_msg_id() - topic1.last_msg_id();
        });
    }

    sort_alpha(topic_rows: TopicRow[]) {
        topic_rows.sort((topic1, topic2) => {
            return topic1.name().localeCompare(topic2.name());
        });
    }

    populate_topic_rows(): TopicRow[] {
        const stream_id = this.stream_id!;
        const batch_size = 10;
        const all_topic_rows = model.get_topic_rows(stream_id);
        this.sort_recent(all_topic_rows);
        // TODO: make sure we get all unread topics at a minimum
        const topic_rows = all_topic_rows.slice(0, batch_size);
        this.sort_alpha(topic_rows);
        return topic_rows;
    }

    make_table(): HTMLTableElement {
        const topic_rows = this.topic_rows;
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
            const row_widget = topic_row_widget.row_widget(
                topic_row_data,
                i,
                selected,
                search_widget,
            );
            row_widgets.push(row_widget);
        }

        const columns = ["Unread", "Topic name", "Messages"];
        return table_widget.table(columns, row_widgets);
    }

    populate() {
        const div = this.div;

        this.topic_rows = this.populate_topic_rows();
        this.update_cursor();

        div.innerHTML = "";
        div.append(this.make_table());
    }

    select_index(index: number) {
        this.cursor.select_index(index);
        this.set_topic_id_from_cursor();
        this.populate();
    }

    clear_selection(): void {
        this.cursor.clear();
        this.set_topic_id_from_cursor();
        this.populate();
    }

    surf(): void {
        this.cursor.first();
        this.set_topic_id_from_cursor();
        this.populate();
    }

    down(): void {
        this.cursor.down();
        this.set_topic_id_from_cursor();
        this.populate();
    }

    up(): void {
        this.cursor.up();
        this.set_topic_id_from_cursor();
        this.populate();
    }
}
