import {ElementLocationInView} from "../lib/element/ElementLocation";
import {By}                    from "../lib/element/Locator";

export interface TkWebElement {
    // [key: string]: (...args: any[]) => Promise<any>;

    getFrWkElement(): any;

    getAttribute(attributeName: string): Promise<string>;

    getProperty(propertyName: string): Promise<string>;

    findElements(locator: By): Promise<TkWebElement[]>;

    isDisplayed(): Promise<boolean>;

    isEnabled(): Promise<boolean>;

    sendKeys(keySequence: string): Promise<void>;

    click(): Promise<void>;

    getText(): Promise<string>;

    move(): Promise<void>;

    getRect(): Promise<object>;

    getLocationInView(): Promise<ElementLocationInView>;

    scrollIntoView(pr?: Promise<any>): Promise<void>;
}