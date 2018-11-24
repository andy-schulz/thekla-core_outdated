import {By as ByWd, ThenableWebDriver} from "selenium-webdriver";
import {WdElement}                     from "../interface/WebElements";
import {By}                            from "../lib/Locator";
let clientSideScripts = require('../../../res/clientsidescripts');

export class LocatorWdjs {

    public static getSelector(locator: By): any {
        switch (locator.selectorType) {
            case "byCss":
                return ByWd.css(locator.selector);
            case "byJs":
                return ByWd.js(locator.function, locator.args);
            case "byCssContainingText":
                // return ByWd.js(clientSideScripts.findByCssContainingText, locator.selector, locator.searchText, parentElement);
                return ByWd.js(clientSideScripts.findByCssContainingText, locator.selector, locator.searchText);
            default:
                throw Error(`Selector ${locator.selector} not implemented for framework WebDriverJS`);
        }

    }

    public static executeSelector(locator: By, parentElement: WdElement, driver: ThenableWebDriver) {

        switch (locator.selectorType) {
            case "byCss":
                return parentElement.findElements(ByWd.css(locator.selector));
            case "byJs":
                return parentElement.findElements(ByWd.js(locator.function, locator.args));
            case "byCssContainingText":
                return driver.findElements(
                    ByWd.js(
                        clientSideScripts.findByCssContainingText,
                        locator.selector,
                        locator.searchText,
                        parentElement));
            default:
                throw Error(`Selector ${locator.selector} not implemented for framework WebDriverJS`);
        }
    }
}