import {promise}                    from "selenium-webdriver";
import {ClientCtrls}                from "../interface/ClientCtrls";
import {By, ByType}                 from "../lib/element/Locator";
import {ClientWdio}                 from "./ClientWdio";
import {ElementRefIO, WebElementIO} from "./wrapper/WebElementIO";
import {Client}                     from "webdriver"

// eslint-disable-next-line @typescript-eslint/no-var-requires
let clientSideScripts = require(`../../../res/browser/clientsidescripts`);
// import * as clientSideScripts from module("../../../res/browser/clientsidescripts");

const getElementsFromSelector = (
    selectorType: string,
    locator: By,
    client: ClientCtrls<Client>,
    parentElement: WebElementIO): Promise<WebElementIO[]> => {
    return new Promise((resolve, reject): void => {
        client.getFrameWorkClient().then((client: Client): void => {
            (client.findElementsFromElement(
                parentElement.getElementId(),
                selectorType,
                locator.selector) as unknown as Promise<ElementRefIO[]>)

                .then((elements: ElementRefIO[]): WebElementIO[] => WebElementIO.createAll(elements,client))
                .then(resolve)
                .catch(reject)
        });
    });
};



export class LocatorWdio {

    private static typeMap = new Map([
        [`byCss`, `css selector`],
        [`byXpath`, `xpath`],
    ]);

    public static getSelectorParams(locator: By): string[] {
        if(LocatorWdio.typeMap.has(locator.selectorType))
            return [LocatorWdio.typeMap.get(locator.selectorType) as string, locator.selector];

        throw new Error(`selector ${locator.selectorType} cant be found`);
    }

    public static executeSelector(locator: By, parentElement: WebElementIO, client: ClientCtrls<Client>): Promise<WebElementIO[]> {
        switch (locator.selectorType) {
            case `byCss`:
                return getElementsFromSelector(`css selector`, locator, client,parentElement);
            case `byXpath`:
                return getElementsFromSelector(`xpath`, locator, client,parentElement);

                // case `byJs`:
                //     return new Promise((resolve, reject): void => {
                //         parentElement.findElements(ByWd.js(locator.function, locator.args))
                //             .then(resolve,reject)
                //             .catch(reject)
                //     });
                // case `byCssContainingText`:
                //     return browser.getFrameWorkClient()
                //         .then((driver): promise.Promise<WebElement[]> => {
                //             return driver.findElements(
                //                 ByWd.js(
                //                     clientSideScripts.findByCssContainingText,
                //                     locator.selector,
                //                     locator.searchText,
                //                     parentElement));
                //         });

            default:
                throw Error(`Selector ${locator.selectorType} not implemented for framework WebDriverJS`);
        }
    }
}