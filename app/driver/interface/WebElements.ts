import {UntilElementCondition} from "../lib/ElementConditions";
import {By}                    from "../lib/Locator";

export interface FrameFinder {
    frame(locator: By): FrameElementFinder;
}



export interface WebFinder {
    all(locator: By): WebElementListFinder;
    element(locator: By): WebElementFinder;
}

export interface FrameElementFinder extends FrameFinder, WebFinder, FinderDescription<FrameElementFinder>{}

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

    shallWait(condition: UntilElementCondition): WebElementFinder;
}

export interface WebElementListFinder extends WebFinder, FinderDescription<WebElementListFinder>{
    count(): Promise<number>;
    getText(): Promise<string[]>;
    filteredByText(text: string): WebElementListFinder;
}

