import * as model from "./backend/model";

import type { ChannelRow } from "./row_types";
import type { SearchWidget } from "./search_widget";

import * as channel_row_widget from "./dom/channel_row_widget";
import { render_big_list } from "./dom/render";
import * as table_widget from "./dom/table_widget";

import { Cursor } from "./cursor";

export class ChannelList {
    search_widget: SearchWidget;
    div: HTMLElement;
    stream_ids: number[];
    channel_rows?: ChannelRow[];
    cursor: Cursor;

    constructor(search_widget: SearchWidget) {
        const div = render_big_list();

        this.stream_ids = [];
        this.cursor = new Cursor();
        this.get_channel_rows();

        this.search_widget = search_widget;
        this.div = div;
    }

    has_selection(): boolean {
        return this.cursor.has_selection();
    }

    get_stream_id(): number | undefined {
        const index = this.cursor.selected_index;

        if (index === undefined) return undefined;

        return this.stream_ids[index];
    }

    select_channel(new_channel_rows: ChannelRow[], channel_id: number) {
        const cursor = this.cursor;

        const index = new_channel_rows.findIndex((channel_row) => {
            return channel_row.stream_id() === channel_id;
        });
        cursor.select_index(index);
    }

    get_channel_row(): ChannelRow | undefined {
        const index = this.cursor.selected_index;
        const channel_rows = this.channel_rows;

        if (index === undefined) return undefined;

        if (channel_rows === undefined) return undefined;

        return channel_rows[index];
    }

    get_channel_id(): number | undefined {
        const channel_row = this.get_channel_row();

        if (channel_row === undefined) return undefined;

        return channel_row.stream_id();
    }

    sort(channel_rows: ChannelRow[]) {
        channel_rows.sort((c1, c2) => {
            return c2.last_msg_id() - c1.last_msg_id();
        });
    }

    get_channel_rows(): ChannelRow[] {
        const cursor = this.cursor;

        const channel_id = this.get_channel_id();

        const channel_rows = model.get_channel_rows();
        this.sort(channel_rows);

        cursor.set_count(channel_rows.length);

        if (channel_id) {
            this.select_channel(channel_rows, channel_id);
        }

        this.stream_ids = channel_rows.map((c) => c.stream_id());

        this.channel_rows = channel_rows;

        return channel_rows;
    }

    make_table(): HTMLElement {
        const search_widget = this.search_widget;
        const cursor = this.cursor;
        const row_widgets = [];

        const channel_rows = this.get_channel_rows();

        for (let i = 0; i < channel_rows.length; ++i) {
            const channel_row = channel_rows[i];
            const selected = cursor.is_selecting(i);
            const row_widget = channel_row_widget.row_widget(
                channel_row,
                i,
                selected,
                search_widget,
            );
            row_widgets.push(row_widget);
        }

        const columns = ["Unread", "Channel", "Topics"];
        return table_widget.table(columns, row_widgets);
    }

    unread_count(): number {
        let count = 0;

        for (const channel_row of this.channel_rows!) {
            count += channel_row.unread_count();
        }

        return count;
    }

    populate() {
        const div = this.div;

        div.innerHTML = "";
        div.append(this.make_table());
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
