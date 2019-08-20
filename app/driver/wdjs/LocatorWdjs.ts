import {By as ByWd, promise, WebDriver} from "selenium-webdriver";
import {ClientCtrls}                    from "../interface/ClientCtrls";
import {By}                             from "../lib/element/Locator";
import {WebElementJS}                   from "./wrapper/WebElementJS";

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

    // public static executeSelector(locator: By, parentElement: WebElementJS, browser: ClientCtrls<WebDriver>): Promise<WebElementJS[]> {

    // switch (locator.selectorType) {
    //     case `byCss`:
    //         return parentElement.findElements(locator)
    //         return new Promise((resolve, reject): void => {
    //             parentElement.findElements(ByWd.css(locator.selector))
    //                 .then(resolve, reject)
    //                 .catch(reject)
    //         });
    //     case `byXpath`:
    //         return new Promise((resolve, reject): void => {
    //             parentElement.findElements(ByWd.xpath(locator.selector))
    //                 .then(resolve, reject)
    //                 .catch(reject)
    //         });
    //     case `byJs`:
    //         return new Promise((resolve, reject): void => {
    //             parentElement.findElements(ByWd.js(locator.function, locator.args))
    //                 .then(resolve,reject)
    //                 .catch(reject)
    //         });
    //     case `byCssContainingText`:
    //         return browser.getFrameWorkClient()
    //             .then((driver): promise.Promise<WebElementJS[]> => {
    //                 return driver.findElements(
    //                     ByWd.js(
    //                         clientSideScripts.findByCssContainingText,
    //                         locator.selector,
    //                         locator.searchText,
    //                         parentElement));
    //             });
    //
    //     default:
    //         throw Error(`Selector ${locator.selectorType} not implemented for framework WebDriverJS`);
    // }
    // }
}