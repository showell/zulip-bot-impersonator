type Opts = {
    size: number;
    get_div: (index: number) => HTMLElement;
    when_done: () => void;
};

class Dummy {
    div: HTMLElement;

    constructor() {
        const div = document.createElement("div");
        div.innerText = "loading...";
        this.div = div;
    }

    hydrate(new_div: HTMLElement): void {
        this.div.innerHTML = "";
        this.div.append(new_div);
    }
}

export class SmartList {
    div: HTMLElement;
    dummies: Dummy[];
    queue: HTMLElement[];
    done: boolean;

    constructor(opts: Opts) {
        const self = this;
        const div = document.createElement("div");
        div.innerText = "loading";

        this.done = false;

        this.dummies = [];
        for (let i = 0; i < opts.size; ++i) {
            const dummy = new Dummy();
            div.append(dummy.div);
            this.dummies.push(dummy);
        }

        setTimeout(() => {
            self.populate(opts);
        }, 0);

        this.queue = [];
        this.div = div;
    }

    append(new_div: HTMLElement): void {
        if (this.done) {
            this.actually_append(new_div);
        } else {
            this.queue.push(new_div);
        }
    }

    actually_append(new_div: HTMLElement): void {
        const dummy = new Dummy();
        dummy.hydrate(new_div);
        this.div.append(dummy.div);
        this.dummies.push(dummy);
    }

    populate(opts: Opts): void {
        const { size, get_div } = opts;
        const div = this.div;
        const dummies = this.dummies;

        for (let i = 0; i < size; ++i) {
            dummies[i].hydrate(get_div(i));
        }

        this.done = true;

        for (const new_div of this.queue) {
            this.actually_append(new_div)
        }
        this.queue = [];

        opts.when_done();
    }
}
