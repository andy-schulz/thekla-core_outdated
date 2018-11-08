import {By} from "../src/lib/Locator";
import {WebElement} from "selenium-webdriver";

export interface WebFinder {
    all(locator: By, description?: string): WebElementListFinder;
    element(locator: By, description?: string): WebElementFinder;
}

export interface WebElementFinder {
    click(): Promise<void>;
    sendKeys(keySequence: string): Promise<void>;
    getDescription(): string;
    getText(): Promise<string>;
    getAttribute(attribute: string): Promise<string>;
    isVisible(): Promise<boolean>;
}

export interface WebElementListFinder extends WebFinder{}

export interface WdElement extends  WebElement {}