import {UntilElementCondition}                    from "../lib/ElementConditions";
import {BrowserWindow}                            from "./BrowserWindow";
import {FrameFinder, WebElementFinder, WebFinder} from "./WebElements";
import {Condition}                                from "../lib/Condition";

export interface BrowserScreenshotData {
    browserName: string;
    browserScreenshotData: string;
}

export interface Browser extends WebFinder, FrameFinder{
    window: BrowserWindow;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(url: string): Promise<any>;
    getCurrentUrl(): Promise<string>;

    quit(): Promise<void>;
    wait(condition: Condition, timeout?: number, errorMessage?: string): Promise<string>;
    wait2(condition: UntilElementCondition, element: WebElementFinder, errorMessage?: string): Promise<string>;

    getTitle(): Promise<string>;
    hasTitle(expectedTitle: string): Promise<boolean>;

    takeScreenshot(): Promise<BrowserScreenshotData>;
    saveScreenshot(filepath: string, filename: string): Promise<string>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeScript(func: Function, ...funcArgs: any[]): Promise<{}>;
}

