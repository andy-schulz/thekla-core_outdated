import {Browser}                                                    from "../../driver/interface/Browser";
import {FrameElementFinder, WebElementFinder, WebElementListFinder} from "../../driver/interface/WebElements";
import {UntilElementCondition}                                      from "../../driver/lib/element/ElementConditions";
import {By}                                                         from "../../driver/lib/element/Locator"

// export interface FinderLocator {
//     type: string;
//     locator: By;
// }

export interface SppFinderWaiter<T> {
    shallWait(condition: UntilElementCondition): T;
}

/**
 * Interface defining the frame creation method
 */
export interface SppFrameFinder {
    frame(locator: By): SppFrameElementFinder;
}

/**
 * Interface defining the waiter creation methods
 */
export interface SppFinder {
    element(locator: By): SppWebElementFinder;
    all(locator: By): SppWebElementListFinder;
}

export interface ElementHelper extends Function {
    (browser: Browser): WebElementFinder;
    description?: () => string;
}

export interface ElementListHelper extends Function {
    (browser: Browser): WebElementListFinder;
    description?: () => string;
}
/**
 * abstract class implementing the finders for sub elements
 */
export abstract class SppFinderRoot implements SppFinder{
    protected _description: string = ``;

    protected constructor(
        public locator: By,
        public getElements: ElementHelper | ElementListHelper) {
    }

    public element(locator: By): SppWebElementFinder {
        const getElements = (browser: Browser): WebElementFinder => {
            return this.getElements(browser).element(locator);
        };
        getElements.description = this.getElements.description;

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return new SppWebElementFinder(locator, getElements);
    }

    public all(locator: By): SppWebElementListFinder {
        const getElements = (browser: Browser): WebElementListFinder => {
            return this.getElements(browser).all(locator);
        };
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return new SppWebElementListFinder(locator, getElements)
    }

    public get description(): string {
        return this._description;
    }
}

/**
 * class representing a single spp web waiter
 */
export class SppWebElementFinder extends SppFinderRoot implements SppFinderWaiter<SppWebElementFinder>{
    public constructor(
        locator: By,
        getElements: (browser: Browser) => WebElementFinder) {
        super(locator, getElements)
    }

    public called(description: string): SppWebElementFinder {
        const desc = (browser: Browser): WebElementFinder => {
            return this.getElements(browser).called(description) as WebElementFinder;
        };

        desc.description = (): string => {
            const desc = this.getElements.description ? this.getElements.description() + ` -> ` : ``;

            return desc + description;
        };

        return new SppWebElementFinder(this.locator, desc);
    }

    public shallWait(condition: UntilElementCondition): SppWebElementFinder {
        const waiter = (browser: Browser): WebElementFinder => {
            return (this.getElements(browser) as WebElementFinder).shallWait(condition);
        };
        waiter.description = this.getElements.description;

        return new SppWebElementFinder(this.locator,waiter);
    }


    public toString(): string {
        return `${this.getElements.description ? this.getElements.description() : `'SppElement'`} located by >>${this.locator.toString()}<<`;
    }
}

/**
 * class representing an spp web waiter list
 */
export class SppWebElementListFinder extends SppFinderRoot{
    public constructor(
        locator: By,
        getElements: (browser: Browser) => WebElementListFinder) {
        super(locator, getElements)
    }

    public filteredByText(text: string): SppWebElementListFinder{
        const getElements = (browser: Browser): WebElementListFinder => {
            return (this.getElements(browser) as WebElementListFinder).filteredByText(text);
        };
        return new SppWebElementListFinder(this.locator,getElements);
    };

    public called(description: string): SppWebElementListFinder {
        const desc = (browser: Browser): WebElementListFinder => {
            return this.getElements(browser).called(description) as WebElementListFinder;
        };
        return new SppWebElementListFinder(this.locator, desc);
    }

    public toString(): string {
        return `${this._description ? this._description : `'SppElementList'`} located by >>${this.locator.toString()}<<`;
    }
}

/**
 * class representing a frame waiter
 */
export class SppFrameElementFinder implements SppFinder, SppFrameFinder, SppFinderWaiter<SppFrameElementFinder>{
    public constructor(
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

    public frame(locator: By): SppFrameElementFinder {
        const switchFrame = (browser: Browser): FrameElementFinder => {
            return this.switchFrame(browser).frame(locator);
        };
        return new SppFrameElementFinder(locator,switchFrame);
    }

    public shallWait(condition: UntilElementCondition): SppFrameElementFinder {
        const waiter = (browser: Browser): FrameElementFinder => {
            return this.switchFrame(browser).shallWait(condition);
        };
        return new SppFrameElementFinder(this.locator,waiter);
    }

    public called(description: string): SppFrameElementFinder {
        const desc = (browser: Browser): FrameElementFinder => {
            return this.switchFrame(browser).called(description);
        };
        return new SppFrameElementFinder(this.locator, desc);
    }

    // toString() {
    //     return `${this._description ? this._description : "'SppFrameElement'"} located by >>${this.locator.toString()}<<`;
    // }
}

/**
 * creating an SppWebElement
 * @param locator - selector to find the Element
 */
export function element(locator: By): SppWebElementFinder {
    const getElements = (browser: Browser): WebElementFinder => {
        return browser.element(locator);
    };
    return new SppWebElementFinder(locator, getElements);
}

/**
 * creating a list of SppWebElements
 * @param locator - selector to find the waiter list
 */
export function all(locator: By): SppWebElementListFinder {
    const getElements = (browser: Browser): WebElementListFinder => {
        return browser.all(locator);
    };
    return new SppWebElementListFinder(locator, getElements);
}

/**
 * creating a SppFramElement
 * @param locator - selector to find the frame
 */
export function frame(locator: By): SppFrameElementFinder {
    const switchFrame = (browser: Browser): FrameElementFinder => {
        return browser.frame(locator);
    };
    return new SppFrameElementFinder(locator, switchFrame);
}