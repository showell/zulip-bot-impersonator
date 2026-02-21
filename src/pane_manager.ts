type PaneWidget = {
    div: HTMLElement;
};

type Pane = {
    key: string;
    pane_widget: PaneWidget;
};

export class PaneManager {
    div: HTMLElement;
    panes: Pane[];

    constructor() {
        const div = document.createElement("div");
        div.style.display = "flex";

        this.div = div;
        this.panes = [];
    }

    add_pane(pane: Pane): void {
        const div = this.div;

        if (this.end_key_matches(pane.key)) {
            console.log("already added", pane.key);
            return;
        }

        this.panes.push(pane);
        div.append(pane.pane_widget.div);
    }

    pop(key: string) {
        if (!this.end_key_matches(key)) {
            console.log("mismatch key", key);
            return;
        }
        this.panes = this.panes.slice(0, this.panes.length - 1);
        this.redraw();
    }

    remove_after(key: string) {
        const new_panes = [];

        for (const pane of this.panes) {
            new_panes.push(pane);
            if (pane.key === key) {
                break;
            }
        }

        this.panes = new_panes;
        this.redraw();
    }

    replace_after(key: string, new_pane: Pane) {
        const new_panes = [];

        for (const pane of this.panes) {
            new_panes.push(pane);
            if (pane.key === key) {
                break;
            }
        }

        new_panes.push(new_pane);

        this.panes = new_panes;
        this.redraw();
    }

    end_key_matches(key: string): boolean {
        const panes = this.panes;
        const size = panes.length;

        if (size === 0) {
            return false;
        }

        return key === panes[size - 1].key;
    }

    redraw(): void {
        // TODO: adjust to screen size
        const div = this.div;
        const panes = this.panes;

        div.innerHTML = "";
        for (const pane of panes) {
            div.append(pane.pane_widget.div);
        }
    }
}
