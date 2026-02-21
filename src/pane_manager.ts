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
        this.div = div;
        this.panes = [];
    }

    set_panes(panes: Pane[]): void {
        this.panes = panes;
        this.redraw();
    }

    add_pane(pane: Pane): void {
        if (this.end_key_matches(pane.key)) {
            console.log("already added", pane.key);
            return;
        }

        this.panes.push(pane);
        this.redraw();
    }

    pop(key: string) {
        if (!this.end_key_matches(key)) {
            console.log("mismatch key", key);
            return;
        }
        this.panes = this.panes.slice(0, this.panes.length - 1);
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

        const new_div = document.createElement("div");
        new_div.style.display = "flex";

        for (const pane of panes) {
            new_div.append(pane.pane_widget.div);
        }

        div.innerHTML = "";
        div.append(new_div);
    }
}

