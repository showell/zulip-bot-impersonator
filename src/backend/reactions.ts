import type { Reaction } from "./db_types";
import type { ReactionEvent } from "./event";

export class ReactionsMap {
    message_reactions_map: Map<number, Reaction[]>;

    constructor() {
        this.message_reactions_map = new Map<number, Reaction[]>();
    }

    get_reactions_for_message_id(message_id: number): Reaction[] {
        return this.message_reactions_map.get(message_id) ?? [];
    }

    add_server_reactions(server_reactions: any[], message_id: number): void {
        const message_reactions_map = this.message_reactions_map;

        const raw_reactions = server_reactions.filter(
            (reaction: any) => reaction.reaction_type === "unicode_emoji",
        );

        // Maps emoji name to a Reaction object.
        const reaction_map = new Map<string, Reaction>();

        for (const raw_reaction of raw_reactions) {
            if (!reaction_map.has(raw_reaction.emoji_name)) {
                const reaction: Reaction = {
                    emoji_code: raw_reaction.emoji_code,
                    emoji_name: raw_reaction.emoji_name,
                    user_ids: new Set<number>([raw_reaction.user_id]),
                    message_id: message_id,
                };
                reaction_map.set(raw_reaction.emoji_name, reaction);
            } else {
                reaction_map
                    .get(raw_reaction.emoji_name)!
                    .user_ids.add(raw_reaction.user_id);
            }
        }
        const reactions = [...reaction_map.values()];
        message_reactions_map.set(message_id, reactions);
    }

    process_add_event(event: ReactionEvent) {
        const message_id = event.message_id;
        const reactions = this.message_reactions_map.get(message_id) ?? [];

        const reaction = reactions.find(
            (reaction) => reaction.emoji_code === event.emoji_code,
        );

        if (reaction) {
            reaction.user_ids.add(event.user_id);
        } else {
            reactions.push({
                message_id: event.message_id,
                emoji_code: event.emoji_code,
                emoji_name: event.emoji_name,
                user_ids: new Set<number>([event.user_id]),
            });
        }

        this.message_reactions_map.set(message_id, reactions);
    }

    process_remove_event(event: ReactionEvent) {
        const message_id = event.message_id;
        const reactions = this.message_reactions_map.get(message_id);

        if (!reactions) {
            console.warn("tried to remove non-existent reaction");
            return;
        }

        const reaction_idx = reactions.findIndex(
            (reaction) => reaction.emoji_code === event.emoji_code,
        );

        const reaction = reactions[reaction_idx];

        if (!reaction) {
            console.warn("tried to remove non-existent reaction");
            return;
        }

        reaction.user_ids.delete(event.user_id);

        if (reaction.user_ids.size === 0) {
            reactions.splice(reaction_idx, 1);

            if (reactions.length === 0) {
                this.message_reactions_map.delete(message_id);
                console.log("removed message_id from reactions map");
            }
        }
    }
}
