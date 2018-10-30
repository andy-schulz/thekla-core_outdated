import {Locator} from "./Locator";
import {WebElement} from "selenium-webdriver";

export interface WebFinder {
    all(locator: Locator): WebElementListFinder;
    element(locator: Locator): WebElementFinder;
}

export interface WebElementFinder {
}

export interface WebElementListFinder extends WebFinder{
}

export interface WdElement extends  WebElement {}