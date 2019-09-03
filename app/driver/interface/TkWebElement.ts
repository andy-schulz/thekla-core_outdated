import {ElementLocationInView, Point, ElementDimensions} from "../lib/element/ElementLocation";
import {By}                                              from "../lib/element/Locator";
import {ElementRefIO}                                    from "../wdio/wrapper/WebElementIO";

export interface TkWebElement<WD> {
    // [key: string]: (...args: any[]) => Promise<any>;

    getFrWkElement(): any;

    getAttribute(attributeName: string): Promise<string>;

    getProperty(propertyName: string): Promise<string>;

    findElements(locator: By): Promise<TkWebElement<WD>[]>;

    isDisplayed(): Promise<boolean>;

    isEnabled(): Promise<boolean>;

    sendKeys(keySequence: string): Promise<void>;

    clear(): Promise<void>;

    click(): Promise<void>;

    getText(): Promise<string>;

    move(): (client: WD) => Promise<WD>;

    getRect(): Promise<ElementDimensions>;

    getCenterPoint(): Promise<Point>;

    getLocationInView(): Promise<ElementLocationInView>;

    scrollIntoView(): Promise<void>;

}