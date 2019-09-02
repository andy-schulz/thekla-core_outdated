import {ElementDimensions, ElementLocationInView, Point} from "../lib/element/ElementLocation";
import {UntilElementCondition}                           from "../lib/element/ElementConditions";
import {By}                                              from "../lib/element/Locator";

export interface FrameFinder {
    frame(locator: By): FrameElementFinder;
}

export interface WebFinder {
    all(locator: By): WebElementListFinder;
    element(locator: By): WebElementFinder;
}

export interface FinderDescription<T> {
    called(description: string): T;
    readonly description: string;
}

export interface FinderWaiter<T> {
    shallWait(condition: UntilElementCondition): T;
}

export interface WebElementFinder
    extends
    WebFinder,
    FinderDescription<WebElementFinder>,
    FinderWaiter<WebElementFinder> {
    clear(): Promise<void>;
    click(): Promise<void>;
    dragToElement(element: WebElementFinder): Promise<void>;
    getText(): Promise<string>;
    getAttribute(attribute: string): Promise<string>;
    getProperty(propertyName: string): Promise<string>;
    getRect(): Promise<ElementDimensions>;
    getElementLocationInView(): Promise<ElementLocationInView>;
    getCenterPoint(): Promise<Point>;
    hover(): Promise<void>;
    isVisible(): Promise<boolean>;
    isDisplayed(): Promise<boolean>;
    isEnabled(): Promise<boolean>;
    sendKeys(keySequence: string): Promise<void>;
    scrollIntoView(): Promise<void>;
    movePointerTo(client: any): Promise<any>;
}

export interface WebElementListFinder
    extends
    WebFinder,
    FinderDescription<WebElementListFinder>{
    count(): Promise<number>;
    getText(): Promise<string[]>;
    filteredByText(text: string): WebElementListFinder;
}

export interface FrameElementFinder
    extends
    FrameFinder,
    WebFinder,
    FinderDescription<FrameElementFinder>,
    FinderWaiter<FrameElementFinder> {
}
