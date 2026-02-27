import { DB } from "./backend/database";

export type Address = {
    channel_id: number | undefined;
    topic_id: number | undefined;
};

export type PathInfo = {
    channel_id: number | undefined;
    topic_name: string | undefined;
};

function unescape(str: string) {
    return decodeURIComponent(str.replace(/\./g, "%"));
}

export function parse_path(path: string): PathInfo | undefined {
    if (path.startsWith("/")) {
        path = path.slice(1);
    }

    if (!path.startsWith("#narrow/channel")) {
        return undefined;
    }

    const [channel_part, _topic, topic_part, _, _message_part] = path
        .split("/")
        .slice(2);

    const channel_id_str = channel_part.split("-")[0]!;
    const channel_id = parseInt(channel_id_str);
    const topic_name =
        topic_part === undefined ? undefined : unescape(topic_part);

    return { channel_id, topic_name };
}

function topic_id_lookup(channel_id: number, topic_name: string): number {
    return DB.topic_map.get_topic_id(channel_id, topic_name);
}

export function get_address_from_path(path: string): Address | undefined {
    if (path.startsWith("/")) {
        path = path.slice(1);
    }

    if (!path.startsWith("#narrow/channel")) {
        return undefined;
    }

    const path_info = parse_path(path);

    if (path_info === undefined) {
        return undefined;
    }

    const channel_id = path_info.channel_id;
    const topic_name = path_info.topic_name;
    const topic_id =
        channel_id && topic_name
            ? topic_id_lookup(channel_id, topic_name)
            : undefined;

    return {
        channel_id,
        topic_id,
    };
}
