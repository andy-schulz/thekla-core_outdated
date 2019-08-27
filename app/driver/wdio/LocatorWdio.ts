import {By}                 from "../lib/element/Locator";

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
}