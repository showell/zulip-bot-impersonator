class DialogShell {
    popup_element: HTMLDialogElement;

    constructor() {
        this.popup_element = this.create_popup_element();
    }

    create_popup_element() {
        // See https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
        const dialog = document.createElement("dialog");
        const s = dialog.style;
        s.maxWidth = "150vw";
        s.borderRadius = "1rem";
        s.outline = "none";
        s.border = "1px #000080 solid";
        s.display = "flex";
        s.flexDirection = "column";
        s.gap = "0.5rem";
        s.alignItems = "center";
        return dialog;
    }

    invoke_with_custom_div(div: HTMLElement) {
        document.body.append(this.popup_element);

        // Ensures it is closed by nothing apart from what we define
        this.popup_element.setAttribute("closedby", "none");
        this.popup_element.append(div);
        this.popup_element.showModal();
    }

    finish(): void {
        this.popup_element.close();
        this.popup_element.innerHTML = "";
        this.popup_element.remove();
        this.popup_element.setAttribute("closedby", "any");
    }
}

type PopupOptions = {
    div: HTMLDivElement;
    confirm_button_text: string;
    callback: () => void;
};

export function pop(info: PopupOptions): void {
    const popup = new Popup();
    popup.show(info);
}

class Popup {
    dialog_shell: DialogShell;

    constructor() {
        this.dialog_shell = new DialogShell();
    }

    make_button(text: string): HTMLElement {
        const button = document.createElement("button");
        button.style.cursor = "pointer";
        button.style.maxWidth = "fit-content";
        button.style.paddingLeft = "15px";
        button.style.paddingRight = "15px";
        button.style.paddingTop = "5px";
        button.style.paddingBottom = "5px";
        button.style.marginTop = "15px";
        button.style.backgroundColor = "#000080";
        button.style.color = "white";

        button.innerText = text;
        return button;
    }

    show(info: PopupOptions) {
        const self = this;

        const button = this.make_button(info.confirm_button_text);
        button.addEventListener("click", () => self.finish(info.callback));

        const button_div = document.createElement("div");
        button_div.append(button);
        button_div.style.display = "flex";
        button_div.style.justifyContent = "end";

        // PUT THEM ALL TOGETHER
        const flex_div = document.createElement("div");
        flex_div.append(info.div);
        flex_div.append(button_div);

        this.dialog_shell.invoke_with_custom_div(flex_div);
    }

    finish(callback?: () => void) {
        this.dialog_shell.finish();
        if (callback) {
            callback();
        }
    }
}
