import {WdElement, WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {By} from "../lib/Locator";
import {WebElementWdjs} from "./WebElementWdjs";
import {WebElement} from "selenium-webdriver";


export class WebElementListWdjs implements WebElementListFinder{

    constructor(
        public getElements: () => Promise<WebElement[]>,
        public getDescription: () => string
    ) {
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
        locator: By,
        description: string = `Element without description`): WebElementFinder {
        const desc = `'${description}' selected by: ${locator.toString()}`;
        return <WebElementFinder>(<WebElementListWdjs>this.all(locator,desc)).toWebElement();
    }

    all(
        locator: By,
        description: string = `Element without description`): WebElementListFinder {

        let getElements = async (): Promise<WdElement[]> => {
            // can be removed when done
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

        let getDescription = () => {
            const desc = `'${description}' selected by: >>${locator.toString()}<<`;
            return desc;
        };

        return new WebElementListWdjs(getElements, getDescription);
    }

    public toWebElement(): WebElementWdjs {
        return new WebElementWdjs(this, () => this.getDescription());
    }
}