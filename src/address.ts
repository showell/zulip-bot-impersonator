export type Address = {
    channel_id: number | undefined;
    topic_id: number | undefined;
};

export type PathInfo = {
    channel_id: number | undefined;
    topic_name: string | undefined;
};

function unescape(str: string) {
    return decodeURIComponent(str.replaceAll(".", "%"));
}

export function parse_path(path: string): PathInfo | undefined {
    if (!path.startsWith("#narrow/channel")) {
        return undefined;
    }

    const [channel_part, _topic, topic_part, _, _message_part] = path
        .split("/")
        .slice(2);
    const channel_id_str = channel_part.split("-")[0]!;
    return {
        channel_id: parseInt(channel_id_str),
        topic_name: unescape(topic_part),
    };
}
