import {By as ByWd, WebElement} from "selenium-webdriver";
import {By}                                                 from "../lib/Locator";
import {BrowserWdjs}                                        from "./BrowserWdjs";
import {WdElement}                                          from "./interfaces/WdElement";

let clientSideScripts = require('../../../res/browser/clientsidescripts');

export class LocatorWdjs {

    public static getSelector(locator: By): any {
        switch (locator.selectorType) {
            case "byCss":
                return ByWd.css(locator.selector);
            case "byXpath":
                return ByWd.xpath(locator.selector);
            case "byJs":
                return ByWd.js(locator.function, locator.args);
            case "byCssContainingText":
                // return ByWd.js(clientSideScripts.findByCssContainingText, locator.selector, locator.searchText, parentElement);
                return ByWd.js(clientSideScripts.findByCssContainingText, locator.selector, locator.searchText);
            default:
                throw Error(`Selector ${locator.selector} not implemented for framework WebDriverJS`);
        }

    }

    public static executeSelector(locator: By, parentElement: WdElement, browser: BrowserWdjs): Promise<WebElement[]> {

        switch (locator.selectorType) {
            case "byCss":
                return new Promise((resolve, reject) => {
                    parentElement.findElements(ByWd.css(locator.selector))
                        .then(resolve, reject)
                        .catch(reject)
                });
            case "byJs":
                return new Promise((resolve, reject) => {
                    parentElement.findElements(ByWd.js(locator.function, locator.args))
                        .then(resolve,reject)
                        .catch(reject)
                });
            case "byCssContainingText":
                return browser.getDriver()
                    .then((driver) => {
                        return driver.findElements(
                            ByWd.js(
                                clientSideScripts.findByCssContainingText,
                                locator.selector,
                                locator.searchText,
                                parentElement));
                    });

            default:
                throw Error(`Selector ${locator.selector} not implemented for framework WebDriverJS`);
        }
    }
}