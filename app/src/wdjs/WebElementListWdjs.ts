import {LocatorWdjs} from "./LocatorWdjs";
import {WdElement, WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {Locator} from "../../interface/Locator";
import {WebElementWdjs} from "./WebElementWdjs";


export class WebElementListWdjs implements WebElementFinder{

    constructor(public getElements: () => Promise<WdElement[]>) {
    }

    /**
     * Send
     */
    sendKeys(keySequence: string) {
        return this.getElements();
    }

    element(locator: Locator): WebElementFinder {
        return <WebElementFinder>(<WebElementListWdjs>this.all(locator)).toWebElement();
    }

    all(locator: LocatorWdjs): WebElementListFinder {
        // let getElements = (): Promise<WebElem[]> => {
        let getElements = async (): Promise<WdElement[]> => {
            // can be removed when done
            return await this.getElements();


            const elements = await this.getElements();

        };
        return new WebElementListWdjs(getElements);
    }

    public toWebElement(): WebElementWdjs {
        return new WebElementWdjs(this);
    }
}