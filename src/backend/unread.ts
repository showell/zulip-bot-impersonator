import { MessageStore } from "./message_store";

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
}
