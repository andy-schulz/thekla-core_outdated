import {WebElement}            from "selenium-webdriver";
import {UntilElementCondition} from "../../lib/ElementConditions";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WdElement extends  WebElement {}

export interface FrameHelper extends Function {
    (conditions: UntilElementCondition[]): Promise<void>;
    // waiter: (condition: UntilElementCondition) => Promise<boolean>;
}

export interface ElementListHelper extends Function {
    (): () => Promise<WdElement[]>;
    // elements?: () => Promise<WdElement[]>;
}