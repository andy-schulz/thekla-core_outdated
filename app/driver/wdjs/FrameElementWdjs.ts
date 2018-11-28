import {ThenableWebDriver}  from "selenium-webdriver";
import {
    WebElementFinder,
    WebElementListFinder,
    FrameElementFinder
}                           from "../interface/WebElements";
import {By}                 from "../lib/Locator";
import {BrowserWdjs}        from "./BrowserWdjs";
import {LocatorWdjs}        from "./LocatorWdjs";
import {WebElementListWdjs} from "./WebElementListWdjs";

export class FrameElementWdjs implements FrameElementFinder {
    private _description = "";
    constructor(
        public switchFrame: () => Promise<void>,
        private _locator: By,
        private browser: BrowserWdjs) {
    }
    public element(
        locator: By): WebElementFinder {

        return (<WebElementListWdjs>this.all(locator)).toWebElement();
    }

    public all(
        locator: By): WebElementListFinder {

        const loc = LocatorWdjs.getSelector(locator);
        let getElements = async () => {
            await this.switchFrame();
            return await this.browser.driver.findElements(loc);
        };

        return new WebElementListWdjs(getElements,locator, this.browser);
    }

    frame(locator: By): FrameElementFinder {
        const loc = LocatorWdjs.getSelector(locator);
        let getElements = async () => {
            await this.switchFrame();
            return await this.browser.driver.switchTo().frame(this.browser.driver.findElement(loc));
        };

        return new FrameElementWdjs(getElements,locator, this.browser);
    }



    get description(): string {
        return this._description;
    }

    public called(description: string): FrameElementFinder {
        this._description = description;
        return this;
    }


}