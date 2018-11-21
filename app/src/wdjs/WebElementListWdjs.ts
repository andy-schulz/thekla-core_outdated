import {WdElement, WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {By} from "../lib/Locator";
import {WebElementWdjs} from "./WebElementWdjs";
import {WebElement} from "selenium-webdriver";


export class WebElementListWdjs implements WebElementListFinder{
    private _description: string = "";
    constructor(
        public getElements: () => Promise<WebElement[]>,
        private _locator: By) {
    }

    /**
     * Send
     */
    // sendKeys(keySequence: string): Promise<void> {
    //     return new Promise((fulfill) => {
    //         this.getElements().then(() => {
    //             fulfill()
    //         });
    //
    //     })
    // }

    element(
        locator: By): WebElementFinder {
        const desc = `'${this.description.replace("'Elements'","'Element'")}'`;
        return <WebElementFinder>(<WebElementListWdjs>this.all(locator)).toWebElement().called(desc);
    }

    all(
        locator: By): WebElementListFinder {

        let getElements = async (): Promise<WdElement[]> => {
            // can be removed when done
            // TODO: Für jedes Element muss noch findElements aufgerufen werden um alle Elemente in der Chain zu finden
            // Lösung über [].reduce.
            return await this.getElements();

            const elements = await this.getElements();
            const els = [];
            const loc = locator.getSelector("wdjs");
            for (const elem of elements) {
                const elemsPromises = elem.findElements(loc);
                els.push(elemsPromises);
            }

            await Promise.all(els);
        };

        return new WebElementListWdjs(getElements,locator);
    }

    public toWebElement(): WebElementWdjs {
        return new WebElementWdjs(this);
    }

    public called(description: string): WebElementListFinder {
        this._description = description;
        return this;
    }

    get description(): string {
        return this._description;
    }

    get locatorDescription() {
        return this._locator.toString();
    }

    toString(): string {
        return `'${this._description ? this._description : "Elements"}' selected by: >>${this._locator.toString()}<<`;
    }
}