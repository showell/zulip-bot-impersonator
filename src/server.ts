import * as database from "./backend/database";
import * as model from "./backend/model";
import * as zulip_client from "./backend/zulip_client";

async function test_image() {
    const url = "https://macandcheese.zulipchat.com/api/v1/user_uploads/2943/ABnDA3NW8ggkafWrk_hDD-HM/image.png"
    await zulip_client.fetch_image(url);
}

async function test(): Promise<void> {
    await database.fetch_original_data();

    console.log(model.get_channel_rows().slice(0, 2));
}

test_image();
