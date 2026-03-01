import * as config from "./config";

class LoginManager {
    div: HTMLDivElement;
    content_div: HTMLDivElement;

    constructor() {
        const div = document.createElement("div");

        const heading = document.createElement("div");
        heading.innerText = "Login Manager";
        heading.style.fontWeight = "bold";
        heading.style.marginBottom = "10px";
        div.append(heading);

        // A dedicated container so we can easily swap between the list and the form
        this.content_div = document.createElement("div");
        div.append(this.content_div);

        this.div = div;
    }

    start(): void {
        // Initial render checks if we have realms or need to show the form
        this.render();
    }

    private render(): void {
        this.content_div.innerHTML = "";
        const available_realms = config.get_available_realms();
        if (available_realms.length === 0) {
            this.render_login_form();
        } else {
            this.render_realm_list(available_realms);
        }
    }

    private render_login_form(): void {
        this.content_div.innerHTML = "";

        const form = document.createElement("form");
        form.style.display = "flex";
        form.style.flexDirection = "column";
        form.style.gap = "8px";

        // Create inputs
        const nickname_input = this.create_input_box(
            "text",
            "Nickname (e.g. Zulip Dev)",
        );
        const url_input = this.create_input_box("url", "Server URL");
        const email_input = this.create_input_box("email", "Email Address");
        const api_key_input = this.create_input_box("password", "API Key");

        const submit_btn = document.createElement("button");
        submit_btn.type = "submit";
        submit_btn.innerText = "Save and Login";

        form.append(
            nickname_input,
            url_input,
            email_input,
            api_key_input,
            submit_btn,
        );

        // If there are existing realms, show a "Cancel" button to go back to the list
        if (config.get_available_realms().length > 0) {
            const cancel_btn = document.createElement("button");
            cancel_btn.type = "button";
            cancel_btn.innerText = "Cancel";
            cancel_btn.onclick = () => this.render();
            form.append(cancel_btn);
        }

        form.onsubmit = (e) => {
            // Prevent page reload
            e.preventDefault();
            const url_val = url_input.value.endsWith("/") ? url_input.value.slice(0, -1) : url_input.value;
            const new_realm = {
                nickname: nickname_input.value,
                url: url_val,
                email: email_input.value,
                api_key: api_key_input.value,
            };

            config.store_realm_config(new_realm);
            window.location.replace(`/${new_realm.nickname}`);
        };

        this.content_div.append(form);
    }

    private render_realm_list(realms: any[]): void {
        this.content_div.innerHTML = "";

        const list_container = document.createElement("div");
        list_container.style.display = "flex";
        list_container.style.flexDirection = "column";
        list_container.style.gap = "8px";

        // Render a button for each existing realm
        for (const realm of realms) {
            const realm_btn = document.createElement("button");
            realm_btn.innerText = `Surf ${realm.nickname} (${realm.email})`;

            realm_btn.onclick = () => {
                window.location.replace(`/${realm.nickname}`);
            };

            list_container.append(realm_btn);
        }

        const add_new_btn = document.createElement("button");
        add_new_btn.innerText = "+ Add New Realm";
        add_new_btn.style.marginTop = "10px";
        add_new_btn.onclick = () => {
            this.render_login_form();
        };

        list_container.append(add_new_btn);
        this.content_div.append(list_container);
    }

    private create_input_box(
        type: string,
        placeholder: string,
    ): HTMLInputElement {
        const input = document.createElement("input");
        input.type = type;
        input.placeholder = placeholder;
        input.required = true;
        return input;
    }
}

function start_login_process() {
  const login_manager = new LoginManager();
  document.body.append(login_manager.div);
  login_manager.start()
}

export function needs_to_login(): boolean {
    // We do many things here and this function probably needs renaming to reflect that:
    // 1. We pick out the nickname passed in the path.
    // 2. We check whether we have a config for this nickname in the local storage.
    // 3. If the config is present, we set_current_realm_config for this Angry Cat tab
    // to that config.
    // 4. Otherwise we paint the login screen that shows the user their available realms
    // and a form to register a realm, the end result is either the user closes the tab for some reason
    // or gets redirected to a path with an existing realm.
    const nickname = window.location.pathname.split("/")[1];
    const config_from_nickname = config.get_realm_config(nickname)
    if (config_from_nickname === undefined) {
        start_login_process()
        return true;
    }
    config.set_current_realm_config(config_from_nickname)
    return false;
}
