import {Browser}                                                    from "../../driver/interface/Browser";
import {FrameElementFinder, WebElementFinder, WebElementListFinder} from "../../driver/interface/WebElements";
import {UntilElementCondition}                                      from "../../driver/lib/ElementConditions";
import {By}                                                         from "../../driver/lib/Locator"

// export interface FinderLocator {
//     type: string;
//     locator: By;
// }

export interface SppFinderWaiter<T> {
    shallWait(condition: UntilElementCondition): T
}

/**
 * Interface defining the frame creation method
 */
export interface SppFrameFinder {
    frame(locator: By): SppFrameElementFinder;
}

/**
 * Interface defining the element creation methods
 */
export interface SppFinder {
    element(locator: By): SppWebElementFinder;
    all(locator: By): SppWebElementListFinder;
}

/**
 * creating an SppWebElement
 * @param locator - selector to find the Element
 */
export function element(locator: By): SppWebElementFinder {
    const getElements = (browser: Browser) => {
        return browser.element(locator);
    };
    return new SppWebElementFinder(locator, getElements);
}

/**
 * creating a list of SppWebElements
 * @param locator - selector to find the element list
 */
export function all(locator: By): SppWebElementListFinder {
    const getElements = (browser: Browser) => {
        return browser.all(locator);
    };
    return new SppWebElementListFinder(locator, getElements);
}

/**
 * creating a SppFramElement
 * @param locator - selector to find the frame
 */
export function frame(locator: By): SppFrameElementFinder {
    const switchFrame = (browser: Browser) => {
        return browser.frame(locator);
    };
    return new SppFrameElementFinder(locator, switchFrame);
}

type GetEl = (browser: Browser) => WebElementFinder
type GetEls = (browser: Browser) => WebElementListFinder
/**
 * abstract class implementing the finders for sub elements
 */
export abstract class SppFinderRoot implements SppFinder{
    protected _description: string = "";

    protected constructor(
        public locator: By,
        public getElements: GetEl | GetEls) {
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

    get description() {
        return this._description;
    }
}

/**
 * class representing a single spp web element
 */
export class SppWebElementFinder extends SppFinderRoot implements SppFinderWaiter<SppWebElementFinder>{
    constructor(
        locator: By,
        getElements: (browser: Browser) => WebElementFinder) {
        super(locator, getElements)
    }

    public called(description: string): SppWebElementFinder {
        const desc = (browser: Browser): WebElementFinder => {
            return this.getElements(browser).called(description) as WebElementFinder;
        };
        return new SppWebElementFinder(this.locator, desc);
    }

    shallWait(condition: UntilElementCondition): SppWebElementFinder {
        const waiter = (browser: Browser): WebElementFinder => {
            return (this.getElements(browser) as WebElementFinder).shallWait(condition);
        };
        return new SppWebElementFinder(this.locator,waiter);
    }


    toString() {
        return `${this._description ? this._description : "'SppElement'"} located by >>${this.locator.toString()}<<`;
    }
}

/**
 * class representing an spp web element list
 */
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

    public called(description: string): SppWebElementListFinder {
        const desc = (browser: Browser): WebElementListFinder => {
            return <WebElementListFinder>this.getElements(browser).called(description);
        };
        return new SppWebElementListFinder(this.locator, desc);
    }

    toString() {
        return `${this._description ? this._description : "'SppElementList'"} located by >>${this.locator.toString()}<<`;
    }
}

/**
 * class representing a frame element
 */
export class SppFrameElementFinder implements SppFinder, SppFrameFinder, SppFinderWaiter<SppFrameElementFinder>{
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

    called(description: string) {
        const desc = (browser: Browser): FrameElementFinder => {
            return this.switchFrame(browser).called(description);
        };
        return new SppFrameElementFinder(this.locator, desc);
    }

    // toString() {
    //     return `${this._description ? this._description : "'SppFrameElement'"} located by >>${this.locator.toString()}<<`;
    // }
}