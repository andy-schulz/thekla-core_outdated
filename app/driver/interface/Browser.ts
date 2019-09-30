/* eslint-disable quotes */
import {DesiredCapabilities}    from "../../config/DesiredCapabilities";
import {ServerConfig}           from "../../config/ServerConfig";
import {BrowserWindow}          from "./BrowserWindow";
import {TkSession}              from "./TkSession";
import {FrameFinder, WebFinder} from "./WebElements";
import {Condition}              from "../lib/Condition";

export interface ScreenshotOptions {
    size?: ScreenshotSize;
}

export interface ScreenshotSize {
    width?: number;
    height?: number;
}

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

    capabilities: {[key: string]: any};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(url: string): Promise<any>;

    getCurrentUrl(): Promise<string>;

    quit(): Promise<void>;

    wait(condition: Condition, timeout?: number, errorMessage?: string): Promise<string>;

    getTitle(): Promise<string>;

    takeScreenshot(options?: ScreenshotOptions): Promise<BrowserScreenshotData>;

    saveScreenshot(filepath: string, filename: string): Promise<string>;

    scrollTo({x, y}: { x: number; y: number }): Promise<void>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeScript(func: Function, ...funcArgs: any[]): Promise<{}>;

    getSession(): Promise<TkSession>;
}

