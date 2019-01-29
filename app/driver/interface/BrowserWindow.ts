import {WindowSize} from "../../config/SeleniumConfig";

export interface BrowserWindow {
    setSize(dimension: WindowSize): Promise<void>;
    getSize(): Promise<WindowSize>;
    maximize(): Promise<void>;
}