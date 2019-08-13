export interface WindowSize {
    width: number;
    height: number;
}

export interface WindowRect {
    width: number;
    height: number;
    x: number;
    y: number;
}

export interface BrowserWindow {
    setToPreset(): Promise<void>;
    setSize(dimension: WindowSize): Promise<void>;
    getSize(): Promise<WindowSize>;
    maximize(): Promise<void>;
}

export interface WindowManager {
    window: BrowserWindow;
    windowManagedBy(window: BrowserWindow): void;
}