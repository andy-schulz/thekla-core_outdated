import {By} from "../../src/lib/Locator"

export interface FinderLocator {
    type: string;
    locator: By;
}

export interface SppFinder {
    /**
     * is used for chainging the element locators
     */
    locators(): FinderLocator[];
    element(locator: By): SppWebElementFinder;
    all(locator: By): SppWebElementListFinder;
}

export function element(locator: By) {
    return new SppWebElementFinder(locator, null);
}

export function all(locator: By) {
    return new SppWebElementListFinder(locator, null);
}

export abstract class SppFinderRoot implements SppFinder{
    protected _description: string = "";

    protected constructor(
        public locator: By,
        private parent: SppFinder | null = null) {
    }

    /**
     * get the locator chain
     */
    public locators(): FinderLocator[] {
        const finderLoc: FinderLocator = {
            type: "",
            locator: this.locator
        };

        if (this.constructor.name === "SppWebElementFinder") {
            finderLoc.type = "element";
        } else if(this.constructor.name === "SppWebElementListFinder") {
            finderLoc.type = "all";
        } else {
            throw new Error("Element is not of type SppWebElementFinder or SppWebElementListFinder");
        }

        const loc = [finderLoc];
        return this.parent === null ? loc : loc.concat((<SppFinder>this.parent).locators());
    }

    public element(locator: By): SppWebElementFinder {
        return new SppWebElementFinder(locator, this);
    }

    all(locator: By): SppWebElementListFinder {
        return new SppWebElementListFinder(locator, this)
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
        parent: SppFinder | null = null) {
        super(locator,parent)
    }

    toString() {
        return `${this._description ? this._description : "'SppElement'"} located by >>${this.locator.toString()}<<`;
    }
}


export class SppWebElementListFinder extends SppFinderRoot{
    constructor(
        locator: By,
        parent: SppFinder | null = null) {
        super(locator,parent)
    }

    toString() {
        return `${this._description ? this._description : "'SppElementList'"} located by >>${this.locator.toString()}<<`;
    }
}