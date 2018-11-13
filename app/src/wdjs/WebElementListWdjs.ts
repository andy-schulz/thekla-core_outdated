import {WdElement, WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {By} from "../lib/Locator";
import {WebElementWdjs} from "./WebElementWdjs";
import {WebElement} from "selenium-webdriver";


export class WebElementListWdjs implements WebElementListFinder{
    private _description: string = "";
    constructor(
        public getElements: () => Promise<WebElement[]>) {
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
        const desc = `'${this.description.replace("'Elements'","'Element'")}' -> selected by: ${locator.toString()}`;
        return <WebElementFinder>(<WebElementListWdjs>this.all(locator)).toWebElement().is(desc);
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

        let desc: string = "";
        if(this.description) {
            desc = `'${this.description.replace("'Element'","'Elements'")}' selected by: >>${locator.toString()}<<`
        } else {
            desc = `'Elements' selected by: >>${locator.toString()}<<`
        }
        return new WebElementListWdjs(getElements).is(desc);
    }

    public toWebElement(): WebElementWdjs {
        return new WebElementWdjs(this);
    }

    public is(description: string): WebElementListFinder {
        this._description = description;
        return this;
    }

    get description(): string {
        return this._description;
    }
}