import type { User } from "./backend/db_types";

import { stream_filter } from "./backend/filter";
import * as model from "./backend/model";

import type { ChannelRow } from "./row_types";

import { render_message_content } from "./message_content";
import { render_pane } from "./render";

function render_text(text: string) {
    const div = document.createElement("div");

    div.innerText = text;
    return div;
}

function render_participants(participants: User[]) {
    const div = document.createElement("div");

    for (const user of participants) {
        div.append(render_text(user.full_name));
    }

    return div;
}

export class ChannelInfo {
    div: HTMLElement;

    constructor(channel_row: ChannelRow) {
        const div = render_pane();

        const rendered_description = channel_row.rendered_description();

        if (rendered_description) {
            div.append(render_message_content(rendered_description));
        }

        const stream_weekly_traffic = channel_row.stream_weekly_traffic();

        if (stream_weekly_traffic) {
            div.append(
                render_text(
                    `traffic: about ${stream_weekly_traffic} messages per week`,
                ),
            );
        }

        const filter = stream_filter(channel_row.stream_id(), channel_row.name());
        const messages = model.filtered_messages(filter);
        const participants = model.participants_for_messages(messages);

        div.append(render_participants(participants));

        this.div = div;
    }
}
