let start_x = 0;
let start_y = 0;

export function initialize(): void {
    document.addEventListener("mousedown", (e) => {
        start_x = e.pageX;
        start_y = e.pageY;
    });
}

export function is_drag(event: Event): boolean {
    const e = event as MouseEvent;

    // This is the "Manhattan" distance, i.e. the distance driving
    // on grid lines.
    const drag_distance =
        Math.abs(e.pageX - start_x) + Math.abs(e.pageY - start_y);

    const sel = window.getSelection();
    const has_selection = sel?.type === "Range" && sel.toString().length > 0;

    return drag_distance > 10 || (drag_distance > 2 && has_selection);
}
