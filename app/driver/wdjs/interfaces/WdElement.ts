import {WebElement} from "selenium-webdriver";

export interface WdElement extends  WebElement {}

export interface FrameHelper extends Function {
    (): Promise<void>;
    element: () => Promise<WdElement>;
}

export interface ElementListHelper extends Function {
    (): () => Promise<WdElement[]>;
    // elements?: () => Promise<WdElement[]>;
}