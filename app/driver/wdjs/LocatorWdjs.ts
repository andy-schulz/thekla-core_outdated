import {By as ByWd, promise, WebElement} from "selenium-webdriver";
import {By}                              from "../lib/Locator";
import {BrowserWdjs}                     from "./BrowserWdjs";
import {WdElement}                       from "./interfaces/WdElement";

// eslint-disable-next-line @typescript-eslint/no-var-requires
let clientSideScripts = require(`../../../res/browser/clientsidescripts`);
// import * as clientSideScripts from module("../../../res/browser/clientsidescripts");

export class LocatorWdjs {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static getSelector(locator: By): any {
        switch (locator.selectorType) {
            case `byCss`:
                return ByWd.css(locator.selector);
            case `byXpath`:
                return ByWd.xpath(locator.selector);
            case `byJs`:
                return ByWd.js(locator.function, locator.args);
            case `byCssContainingText`:
                // return ByWd.js(clientSideScripts.findByCssContainingText, locator.selector, locator.searchText, parentElement);
                return ByWd.js(clientSideScripts.findByCssContainingText, locator.selector, locator.searchText);
            default:
                throw Error(`Selector ${locator.selectorType} not implemented for framework WebDriverJS`);
        }

    }

    public static executeSelector(locator: By, parentElement: WdElement, browser: BrowserWdjs): Promise<WebElement[]> {

        switch (locator.selectorType) {
            case `byCss`:
                return new Promise((resolve, reject): void => {
                    parentElement.findElements(ByWd.css(locator.selector))
                        .then(resolve, reject)
                        .catch(reject)
                });
            case `byXpath`:
                return new Promise((resolve, reject): void => {
                    parentElement.findElements(ByWd.xpath(locator.selector))
                        .then(resolve, reject)
                        .catch(reject)
                });
            case `byJs`:
                return new Promise((resolve, reject): void => {
                    parentElement.findElements(ByWd.js(locator.function, locator.args))
                        .then(resolve,reject)
                        .catch(reject)
                });
            case `byCssContainingText`:
                return browser.getDriver()
                    .then((driver): promise.Promise<WebElement[]> => {
                        return driver.findElements(
                            ByWd.js(
                                clientSideScripts.findByCssContainingText,
                                locator.selector,
                                locator.searchText,
                                parentElement));
                    });

            default:
                throw Error(`Selector ${locator.selectorType} not implemented for framework WebDriverJS`);
        }
    }
}