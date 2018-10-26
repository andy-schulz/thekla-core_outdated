import {Locator} from "./Locator";
import {WebElement} from "./WebElement";

export interface Browser {

    element(locator: Locator): WebElement
}