import {By} from "../src/lib/Locator";
import {WebElement} from "selenium-webdriver";

export interface WebFinder {
    all(locator: By): WebElementListFinder;
    element(locator: By): WebElementFinder;
}

export interface FinderDescription<T> {
    called(description: string): T;
    readonly description: string;
}

export interface WebElementFinder extends WebFinder, FinderDescription<WebElementFinder>  {
    click(): Promise<void>;
    sendKeys(keySequence: string): Promise<void>;
    getText(): Promise<string>;
    getAttribute(attribute: string): Promise<string>;
    isVisible(): Promise<boolean>;
}

export interface WebElementListFinder extends WebFinder, FinderDescription<WebElementListFinder>{
    count(): Promise<number>;
    getText(): Promise<string[]>;
    filteredByText(text: string): WebElementListFinder;
}

export interface WdElement extends  WebElement {}