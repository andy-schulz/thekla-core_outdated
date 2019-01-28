import {FrameFinder, WebFinder} from "./WebElements";
import {Condition}              from "../lib/Condition";

export interface Browser extends WebFinder, FrameFinder{
    get(url: string): Promise<any>;
    quit(): Promise<void>;
    wait(condition: Condition, timeout?: number, errorMessage?: string): Promise<string>;
    getTitle(): Promise<string>;
    hasTitle(expectedTitle: string): Promise<boolean>;
    takeScreenshot(): Promise<string>;
    saveScreenshot(filepath: string, filename: string): Promise<string>;

}

