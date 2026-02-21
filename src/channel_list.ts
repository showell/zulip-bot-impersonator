import * as model from "./backend/model";

import type { ChannelRow } from "./row_types";
import type { SearchWidget } from "./search_widget";

import { ChannelRowWidget } from "./channel_row_widget";
import { Cursor } from "./cursor";
import { render_thead, render_th, render_big_list } from "./render";

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

    get_channel_row(): ChannelRow | undefined {
        const index = this.cursor.selected_index;
        const channel_rows = this.channel_rows;

        if (index === undefined) return undefined;

        if (channel_rows === undefined) return undefined;

        return channel_rows[index];
    }

    make_thead(): HTMLElement {
        const thead = render_thead([
            render_th("Unread"),
            render_th("Channel"),
            render_th("Topics"),
        ]);

        return thead;
    }

    sort(channel_rows: ChannelRow[]) {
        channel_rows.sort((c1, c2) => {
            return c2.last_msg_id() - c1.last_msg_id();
        });
    }

    get_channel_rows(): ChannelRow[] {
        const cursor = this.cursor;

        const channel_rows = model.get_channel_rows();
        this.sort(channel_rows);

        cursor.set_count(channel_rows.length);

        this.stream_ids = channel_rows.map((c) => c.stream_id());

        this.channel_rows = channel_rows;

        return channel_rows;
    }

    make_tbody(): HTMLElement {
        const search_widget = this.search_widget;
        const cursor = this.cursor;
        const channel_rows = this.get_channel_rows();

        const tbody = document.createElement("tbody");

        for (let i = 0; i < channel_rows.length; ++i) {
            const channel_row = channel_rows[i];
            const selected = cursor.is_selecting(i);
            const channel_row_widget = new ChannelRowWidget(
                channel_row,
                i,
                selected,
                search_widget,
            );
            tbody.append(channel_row_widget.tr);
        }

        return tbody;
    }

    make_table(): HTMLElement {
        const thead = this.make_thead();
        const tbody = this.make_tbody();

        const table = document.createElement("table");
        table.append(thead);
        table.append(tbody);

        table.style.borderCollapse = "collapse";

        return table;
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
