import * as model from "./backend/model";

async function test(): Promise<void> {
    const data = await model.fetch_model_data();

    console.log(model.get_channel_rows().slice(0, 2));
}

test();
