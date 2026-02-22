import { NarrowAddress, StreamMessage, Topic } from "./db_types";
import { stream_filter, topic_filter } from "./filter";
import { MessageStore } from "./message_store";
import { stream_for } from "./model";

export class UnreadManager {
    message_store: MessageStore;
    constructor(message_store: MessageStore) {
        this.message_store = message_store;
    }

    // Gets the count of the all the unread messages
    // present in the message store.
    get_total_unread_count(): number {
        let count = 0;
        this.message_store.stream_messages.forEach((message) => {
            if (message.unread) {
                count++;
          }
        })
        return count;
    }

    get_unread_count_for_narrow(narrow_address: NarrowAddress) : number{
        const {stream_id, topic_name} = narrow_address
        if (topic_name) {
            if (!stream_id) {
                // This case is unlikely to happen so we just return 0.
                return 0;
            }
            const topic = new Topic(stream_id, topic_name);
            const messages = this.message_store.filtered_messages(topic_filter(topic))
            return this.get_total_unread_count_for_messages(messages);
        }

        if (stream_id) {
            const messages = this.message_store.filtered_messages(stream_filter(stream_for(stream_id)))
            return this.get_total_unread_count_for_messages(messages);
        } else {
            return this.get_total_unread_count();
        }
    }

    get_total_unread_count_for_messages(messages:StreamMessage[]): number{
        let count = 0;
        for (const message of messages) {
            if (message.unread) {
                count++;
          }
        }

        return count;
    }
}
