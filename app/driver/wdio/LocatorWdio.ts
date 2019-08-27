import {Client}                  from "webdriver";
import {TkWebElement}            from "../interface/TkWebElement";
import {findByCssContainingText} from "../lib/client_side_scripts/locators";
import {By}                      from "../lib/element/Locator";
import {funcToString}            from "../utils/Utils";
import {ElementRefIO, WebElementIO}            from "./wrapper/WebElementIO";

export class LocatorWdio {
    public static elementKey = `element-6066-11e4-a52e-4f735466cecf`;

    private static typeMap = new Map([
        [`byCss`, `css selector`],
        [`byXpath`, `xpath`],
    ]);

    public static getSelectorParams(locator: By): string[] {
        if(LocatorWdio.typeMap.has(locator.selectorType))
            return [LocatorWdio.typeMap.get(locator.selectorType) as string, locator.selector];

        throw new Error(`selector ${locator.selectorType} cant be found`);
    }

    public static findElements = (locator: By, client: Client, element?: ElementRefIO): Promise<TkWebElement[]> => {
        switch (locator.selectorType) {
            case `byCss`:
                return LocatorWdio.findElemsFromElem(client, `css selector`, locator.selector, element);
            case `byXpath`:
                return LocatorWdio.findElemsFromElem(client, `xpath`, locator.selector, element);
            case `byJs`:
            case `byCssContainingText`:
                return LocatorWdio.findElemsFromElemByJs(client, locator, element);
            default:
                throw Error(`Selector ${locator.selectorType} not implemented for framework WebDriverJS`);
        }
    };

    private static findElemsFromElem = (client: Client, strategy: string, selector: string, element?: ElementRefIO): Promise<TkWebElement[]> => {
        return (element ?
            (client.findElementsFromElement(
                element[LocatorWdio.elementKey],
                strategy,
                selector) as unknown as Promise<ElementRefIO[]>) :
            (client.findElements(
                strategy,
                selector) as unknown as Promise<ElementRefIO[]>))
            .then((elements: ElementRefIO[]): TkWebElement[] => WebElementIO.createAll(elements, client));
    };

    private static findElemsFromElemByJs = (client: Client, locator: By, element?: ElementRefIO): Promise<TkWebElement[]> => {
        return client.executeScript(
            funcToString(findByCssContainingText),
            [...locator.args, element])
            .then((elements: ElementRefIO[]): TkWebElement[] => WebElementIO.createAll(elements, client));
    };
}