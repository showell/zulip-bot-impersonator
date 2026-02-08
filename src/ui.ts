import {
  get_current_bot_name,
  send_bot_message,
  set_current_bot,
} from "./main";
import { admin_bots, self_creds, ZulipAccount } from "./secrets";

class StatusBar {
  status_text?: string;
  status_bar_ele: HTMLElement;

  constructor(status_text?: string) {
    this.status_text = status_text;
    this.status_bar_ele = this.create_status_bar_ele(status_text);
  }

  create_status_bar_ele(status_text?: string) {
    const ele = document.createElement("div");
    ele.textContent = this.status_text ?? "";
    return ele;
  }

  render() {
    document.body.append(this.status_bar_ele);
  }

  update_text(str: string) {
    this.status_bar_ele.textContent = str;
  }
}

class MessageFeed {
  feed_container: HTMLElement;
  constructor() {
    this.feed_container = this.create_feed_container();
  }

  create_feed_container() {
    const container = document.createElement("div");
    const container_styles: Partial<CSSStyleDeclaration> = {
      maxHeight: "60vh",
      minHeight: "60vh",
      backgroundColor: "lightgray",
      overflowY: "auto",
    };
    Object.assign(container.style, container_styles);

    return container;
  }
  render() {
    document.body.append(this.feed_container);
  }

  add_new_message(sender_name: string, content: string) {
    const sender_name_ele = document.createElement("div");
    const content_ele = document.createElement("pre");
    content_ele.textContent = content;
    sender_name_ele.textContent = sender_name;
    this.feed_container.append(sender_name_ele, content_ele);
  }
}
const message_feed: MessageFeed = new MessageFeed();
const status_bar: StatusBar = new StatusBar();

export function show_status_bar() {
  status_bar.render();
}

export function show_message_feed() {
  message_feed.render();
}

export function show_composebox() {
  const textarea = document.createElement("textarea");
  textarea.style.width = "70%";
  textarea.placeholder = `Type some text as ${get_current_bot_name()}`;

  const send_btn = document.createElement("button");
  send_btn.innerText = "Send";
  send_btn.addEventListener("click", () => send_bot_message(textarea.value));

  document.body.append(textarea);
  document.body.append(send_btn);
}

export function show_right_sidebar() {
  const self = self_creds;
  const bots = [self, ...admin_bots];
  const right_sidebar = document.createElement("div");
  const right_sidebar_styles: Partial<CSSStyleDeclaration> = {
    position: "absolute",
    top: "0",
    right: "0",
    width: "20vw",
    height: "100%",
    backgroundColor: "pink",
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  };

  Object.assign(right_sidebar.style, right_sidebar_styles);

  for (const bot of bots) {
    right_sidebar.append(get_bot_button(bot));
  }
  document.body.append(right_sidebar);
}

function get_bot_button(bot: ZulipAccount) {
  const bot_button = document.createElement("button");
  bot_button.innerText = bot.name;
  bot_button.addEventListener("click", () => {
    set_current_bot(bot);
    status_bar.update_text("Active bot:" + bot.name);
  });
  return bot_button;
}

export function add_new_message_to_message_feed(
  sender_name: string,
  content: string,
) {
  message_feed.add_new_message(sender_name, content);
}

export function render_everything() {
  show_status_bar();
  status_bar.update_text("Active bot:" + get_current_bot_name());
  show_message_feed();
  show_composebox();
  show_right_sidebar();
}
