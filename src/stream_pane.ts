import * as model from "./backend/model";
import type { ChannelRow } from "./backend/row_types";

import { Cursor } from "./cursor";
import {
    render_list_heading,
    render_thead,
    render_th,
    render_tr,
    render_big_list,
    render_pane,
} from "./render";

type CallbackType = {
    clear_stream(): void;
    set_stream_index(index: number): void;
};

function render_stream_count(count: number): HTMLElement {
    const div = document.createElement("div");
    div.innerText = `${count}`;
    div.style.textAlign = "right";

    return div;
}

function render_stream_name(topic_name: string): HTMLElement {
    const div = document.createElement("div");
    div.innerText = topic_name;
    div.style.maxWidth = "270px";
    div.style.overflowWrap = "break-word";
    div.style.color = "#000080";
    div.style.cursor = "pointer";

    return div;
}

class StreamRowName {
    div: HTMLElement;

    constructor(
        channel_row: ChannelRow,
        index: number,
        selected: boolean,
        callbacks: CallbackType,
    ) {
        const div = render_stream_name(channel_row.name());

        div.addEventListener("click", () => {
            if (selected) {
                callbacks.clear_stream();
            } else {
                callbacks.set_stream_index(index);
            }
        });

        if (selected) {
            div.style.backgroundColor = "cyan";
        }

        this.div = div;
    }
}

class StreamRow {
    tr: HTMLElement;

    constructor(
        channel_row: ChannelRow,
        index: number,
        selected: boolean,
        callbacks: CallbackType,
    ) {
        const stream_row_name = new StreamRowName(
            channel_row,
            index,
            selected,
            callbacks,
        );

        this.tr = render_tr([
            render_stream_count(channel_row.num_messages()),
            stream_row_name.div,
        ]);
    }
}

export class StreamList {
    callbacks: CallbackType;
    div: HTMLElement;
    stream_ids: number[];
    cursor: Cursor;

    constructor(callbacks: CallbackType) {
        const div = render_big_list();

        this.stream_ids = [];
        this.cursor = new Cursor();
        this.get_channel_rows();

        this.callbacks = callbacks;
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

    make_thead(): HTMLElement {
        const thead = render_thead([render_th("Count"), render_th("Channel")]);

        return thead;
    }

    sort(channel_rows: ChannelRow[]) {
        channel_rows.sort((c1, c2) => {
            return c2.num_messages() - c1.num_messages();
        });
    }

    get_channel_rows(): ChannelRow[] {
        const cursor = this.cursor;

        const channel_rows = model.get_channel_rows();
        this.sort(channel_rows);

        cursor.set_count(channel_rows.length);

        this.stream_ids = channel_rows.map((c) => c.stream_id());

        return channel_rows;
    }

    make_tbody(): HTMLElement {
        const callbacks = this.callbacks;
        const cursor = this.cursor;
        const channel_rows = this.get_channel_rows();

        const tbody = document.createElement("tbody");

        for (let i = 0; i < channel_rows.length; ++i) {
            const channel_row = channel_rows[i];
            const selected = cursor.is_selecting(i);
            const stream_row = new StreamRow(channel_row, i, selected, callbacks);
            tbody.append(stream_row.tr);
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

export class StreamPane {
    div: HTMLElement;
    stream_list: StreamList;

    constructor(callbacks: CallbackType) {
        const div = render_pane();

        this.stream_list = new StreamList(callbacks);

        this.div = div;
        this.populate();
    }

    stream_selected(): boolean {
        return this.stream_list.has_selection();
    }

    get_stream_list(): StreamList {
        return this.stream_list;
    }

    populate() {
        const div = this.div;
        const stream_list = this.stream_list;

        stream_list.populate();

        div.innerHTML = "";
        div.append(render_list_heading("Channels"));
        div.append(stream_list.div);
    }
}
