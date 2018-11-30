import {Browser}                                                    from "../../driver/interface/Browser";
import {FrameElementFinder, WebElementFinder, WebElementListFinder} from "../../driver/interface/WebElements";
import {UntilElementCondition}                                      from "../../driver/lib/ElementConditions";
import {By}                                                         from "../../driver/lib/Locator"

// export interface FinderLocator {
//     type: string;
//     locator: By;
// }

export interface SppFrameFinder {
    frame(locator: By): SppFrameElementFinder;
}

export interface SppFinder {
    element(locator: By): SppWebElementFinder;
    all(locator: By): SppWebElementListFinder;
}

export function element(locator: By): SppWebElementFinder {
    const getElements = (browser: Browser) => {
        return browser.element(locator);
    };
    return new SppWebElementFinder(locator, getElements);
}

export function all(locator: By): SppWebElementListFinder {
    const getElements = (browser: Browser) => {
        return browser.all(locator);
    };
    return new SppWebElementListFinder(locator, getElements);
}

export function frame(locator: By): SppFrameElementFinder {
    const switchFrame = (browser: Browser) => {
        return browser.frame(locator);
    };
    return new SppFrameElementFinder(locator, switchFrame);
}

export abstract class SppFinderRoot implements SppFinder{
    protected _description: string = "";

    protected constructor(
        public locator: By,
        public getElements: (browser: Browser) => WebElementFinder | WebElementListFinder) {
    }

    public element(locator: By): SppWebElementFinder {
        const getElements = (browser: Browser): WebElementFinder => {
            return this.getElements(browser).element(locator);
        };
        return new SppWebElementFinder(locator, getElements);
    }

    public all(locator: By): SppWebElementListFinder {
        const getElements = (browser: Browser): WebElementListFinder => {
            return this.getElements(browser).all(locator);
        };
        return new SppWebElementListFinder(locator, getElements)
    }

    public called(description: string): SppFinderRoot {
        this._description = description;
        return this;
    }

    get description() {
        return this._description;
    }
}

export class SppWebElementFinder extends SppFinderRoot{
    constructor(
        locator: By,
        getElements: (browser: Browser) => WebElementFinder) {
        super(locator, getElements)
    }

    toString() {
        return `${this._description ? this._description : "'SppElement'"} located by >>${this.locator.toString()}<<`;
    }
}


export class SppWebElementListFinder extends SppFinderRoot{
    constructor(
        locator: By,
        getElements: (browser: Browser) => WebElementListFinder) {
        super(locator, getElements)
    }

    filteredByText(text: string): SppWebElementListFinder{
        const getElements = (browser: Browser): WebElementListFinder => {
            return (<WebElementListFinder>this.getElements(browser)).filteredByText(text);
        };
        return new SppWebElementListFinder(this.locator,getElements);
    };

    toString() {
        return `${this._description ? this._description : "'SppElementList'"} located by >>${this.locator.toString()}<<`;
    }
}


export class SppFrameElementFinder implements SppFinder, SppFrameFinder{
    constructor(
        private locator: By,
        private switchFrame: (browser: Browser) => FrameElementFinder) {
    }

    public element(locator: By): SppWebElementFinder {
        const getElements = (browser: Browser): WebElementFinder => {
            return this.switchFrame(browser).element(locator);
        };
        return new SppWebElementFinder(locator, getElements);
    }

    public all(locator: By): SppWebElementListFinder {
        const getElements = (browser: Browser): WebElementListFinder => {
            return this.switchFrame(browser).all(locator);
        };
        return new SppWebElementListFinder(locator, getElements)
    }

    frame(locator: By): SppFrameElementFinder {
        const switchFrame = (browser: Browser): FrameElementFinder => {
            return this.switchFrame(browser).frame(locator);
        };
        return new SppFrameElementFinder(locator,switchFrame);
    }

    shallWait(condition: UntilElementCondition): SppFrameElementFinder {
        const waiter = (browser: Browser): FrameElementFinder => {
            return this.switchFrame(browser).shallWait(condition);
        };
        return new SppFrameElementFinder(this.locator,waiter);
    }

    // toString() {
    //     return `${this._description ? this._description : "'SppFrameElement'"} located by >>${this.locator.toString()}<<`;
    // }
}