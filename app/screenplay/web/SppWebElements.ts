import {Browser}                                from "../../interface/Browser";
import {WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {By}                                     from "../../src/lib/Locator"

export interface FinderLocator {
    type: string;
    locator: By;
}

export interface SppFinder {
    element(locator: By): SppWebElementFinder;
    all(locator: By): SppWebElementListFinder;
}

export function element(locator: By) {
    const getElements = (browser: Browser) => {
        return browser.element(locator);
    };
    return new SppWebElementFinder(locator, getElements);
}

export function all(locator: By) {
    const getElements = (browser: Browser) => {
        return browser.all(locator);
    };
    return new SppWebElementListFinder(locator, getElements);
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

    all(locator: By): SppWebElementListFinder {
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