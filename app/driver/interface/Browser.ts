import {DesiredCapabilities}                      from "../../config/DesiredCapabilities";
import {ServerConfig}                             from "../../config/ServerConfig";
import {UntilElementCondition}                    from "../lib/element/ElementConditions";
import {BrowserWindow}                            from "./BrowserWindow";
import {ClientCtrls}                              from "./ClientCtrls";
import {TkSession}                                from "./TkSession";
import {FrameFinder, WebElementFinder, WebFinder} from "./WebElements";
import {Condition}                                from "../lib/Condition";

export interface BrowserScreenshotData {
    browserName: string;
    browserScreenshotData: string;
}

export interface CreateClient {
    serverConfig: ServerConfig;
    capabilities: DesiredCapabilities;
    clientName?: string;
    sessionId?: string;
}

export interface Browser extends WebFinder, FrameFinder {
    window: BrowserWindow;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(url: string): Promise<any>;
    getCurrentUrl(): Promise<string>;

    quit(): Promise<void>;
    wait(condition: Condition, timeout?: number, errorMessage?: string): Promise<string>;

    getTitle(): Promise<string>;
    hasTitle(expectedTitle: string): Promise<boolean>;

    takeScreenshot(): Promise<BrowserScreenshotData>;
    saveScreenshot(filepath: string, filename: string): Promise<string>;

    scrollTo({x,y}: {x: number; y: number}): Promise<void>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeScript(func: Function, ...funcArgs: any[]): Promise<{}>;

    getSession(): Promise<TkSession>;
}

