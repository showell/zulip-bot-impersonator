import type { Topic } from "./backend/db_types";
import type { TopicRow } from "./backend/row_types";

import * as model from "./backend/model";

import type { SearchWidget } from "./search_widget";

import { Cursor } from "./cursor";
import { render_thead, render_th, render_big_list } from "./render";
import { TopicRowWidget } from "./topic_row_widget";

export class TopicList {
    div: HTMLElement;
    topic_rows: TopicRow[];
    cursor: Cursor;
    stream_id: number;
    search_widget: SearchWidget;

    constructor(stream_id: number, search_widget: SearchWidget) {
        this.search_widget = search_widget;

        const div = render_big_list();

        this.stream_id = stream_id;

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

    get_current_topic(): Topic | undefined {
        const index = this.cursor.selected_index;

        if (index === undefined) return undefined;

        return this.topic_rows[index].topic;
    }

    refresh_topics_with_topic_name_selected(topic_name: string): void {
        const new_topic_rows = this.get_topic_rows();
        const cursor = this.cursor;

        const index = new_topic_rows.findIndex((topic_row) => {
            return topic_row.topic.name === topic_name;
        });
        cursor.select_index(index);

        this.populate_from_topic_rows(new_topic_rows);
    }

    refresh(): void {
        const topic = this.get_current_topic();
        const cursor = this.cursor;

        const new_topic_rows = this.get_topic_rows();

        if (topic) {
            const new_index = new_topic_rows.findIndex((topic_row) => {
                return topic_row.topic.name === topic.name;
            });
            cursor.select_index(new_index);
        }

        this.populate_from_topic_rows(new_topic_rows);
    }

    make_thead(): HTMLElement {
        const thead = render_thead([
            render_th("Msgs"),
            render_th("Unread"),
            render_th("Topic name"),
        ]);

        return thead;
    }

    get_topic_rows(): TopicRow[] {
        const stream_id = this.stream_id!;
        const cursor = this.cursor;

        const topic_rows = model.get_topic_rows(stream_id);

        topic_rows.sort((t1, t2) => t2.last_msg_id - t1.last_msg_id);
        // topics.sort((t1, t2) => t1.name.localeCompare(t2.name));

        cursor.set_count(topic_rows.length);

        this.topic_rows = topic_rows;

        return topic_rows;
    }

    make_tbody(topic_rows: TopicRow[]): HTMLElement {
        const search_widget = this.search_widget;
        const cursor = this.cursor;

        const tbody = document.createElement("tbody");

        for (let i = 0; i < topic_rows.length; ++i) {
            const topic_row = topic_rows[i];
            const selected = cursor.is_selecting(i);
            const topic_row_data = {
                name: topic_row.topic.name,
                msg_count: topic_row.msg_count,
                unread_count: topic_row.unread_count,
            };
            const topic_row_widget = new TopicRowWidget(
                topic_row_data,
                i,
                selected,
                search_widget,
            );
            tbody.append(topic_row_widget.tr);
        }

        return tbody;
    }

    make_table(topic_rows: TopicRow[]): HTMLElement {
        const thead = this.make_thead();
        const tbody = this.make_tbody(topic_rows);

        const table = document.createElement("table");
        table.append(thead);
        table.append(tbody);

        table.style.borderCollapse = "collapse";

        return table;
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
