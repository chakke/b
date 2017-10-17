import { AppLoop } from '../app-loop';

export interface ScrollOption {
    alpha: number;
    callback;
}
export class ScrollDiv {
    id: string = "";
    element: HTMLElement;
    alpha: number = 0.2;
    done: boolean = false;
    /**1 : top, 2 : bottom, 3 : custom */
    direction: number = 1;
    top: number = 0;
    left: number = 0;
    mCallback = null;

    constructor(id: string) {
        this.id = id;
        this.element = document.getElementById(id);
    }

    setOption(option: ScrollOption) {
        if (option) {
            this.mCallback = option.callback;
            this.alpha = option.alpha;
        }
    }

    getId() {
        return this.id;
    }
    onUpdate() {
        if (this.done) return;

        if (this.direction == 1) {
            let dx = this.alpha * (0 - this.element.scrollTop);
            if (Math.abs(dx) < 1) {
                this.element.scrollTop = 0;
                this.done = true;
            } else {
                this.element.scrollTop += dx;
            }
        } else if (this.direction == 2) {
            let dx = this.alpha * (this.element.scrollHeight - this.element.clientHeight - this.element.scrollTop);
            if (Math.abs(dx) < 1) {
                this.element.scrollTop = this.element.scrollHeight;
                this.done = true;
            } else {
                this.element.scrollTop += dx;
            }
        } else if (this.direction == 3) {
            let dx = this.alpha * (this.top - this.element.scrollTop);
            if (Math.abs(dx) < 1) {
                this.element.scrollTop = this.top;
                this.done = true;
            } else {
                this.element.scrollTop += dx;
            }
        }
        else if (this.direction == 4) {
            let dx = this.alpha * (this.left - this.element.scrollLeft);
            if (Math.abs(dx) < 1) {
                this.element.scrollLeft = this.left;
                this.done = true;
            } else {
                this.element.scrollLeft += dx;
            }
        }
    }
    scrollToLeft(left: number) {
        this.left = left;
        this.direction = 4;
    }
    scrollTo(top: number) {
        this.top = top;
        this.direction = 3;
    }
    scrollToTop() {
        this.direction = 1;
    }
    scrollToBottom() {
        this.direction = 2;
    }
    hasDone() {
        return this.done;
    }
}

export class ScrollController {

    items: Map<string, ScrollDiv> = new Map<string, ScrollDiv>();

    mRunning: boolean = false;

    constructor() {

    }

    checkUpdate() {
        if (this.mRunning) return;
        AppLoop.getInstance().scheduleUpdate(this);
        this.mRunning = true;
    }
    doScroll(divID: string, top: number, option?: ScrollOption) {
        this.checkUpdate();
        let item = this.getItem(divID);
        if (!item) {
            item = new ScrollDiv(divID);
            item.setOption(option);
            item.scrollTo(top);
            this.items.set(divID, item);
        }
    }
    doScrollLeft(divID: string, left: number, option?: ScrollOption) {
        this.checkUpdate();
        let item = this.getItem(divID);
        if (!item) {
            item = new ScrollDiv(divID);
            item.setOption(option);
            item.scrollToLeft(left);
            this.items.set(divID, item);
        }
    }
    doScrollTop(divID: string, option?: ScrollOption) {
        this.checkUpdate();
        let item = this.getItem(divID);
        if (!item) {
            item = new ScrollDiv(divID);
            item.setOption(option);
            item.scrollToTop();
            this.items.set(divID, item);
        }
    }
    doScrollBottom(divID: string, option?: ScrollOption) {
        this.checkUpdate();
        let item = this.getItem(divID);
        if (!item) {
            item = new ScrollDiv(divID);
            item.setOption(option);
            item.scrollToBottom();
            this.items.set(divID, item);
        }
    }

    getItem(divID: string) {
        if (this.items.has(divID)) return this.items.get(divID);
        return null;
    }

    onUpdate() {
        if (this.items.size > 0) {
            this.items.forEach(item => {
                item.onUpdate();
                if (item.hasDone()) {
                    if (item.mCallback) {
                        item.mCallback();
                        item.mCallback = null;
                    }
                    this.items.delete(item.getId());
                    return;
                }
            });
        }
    }


}