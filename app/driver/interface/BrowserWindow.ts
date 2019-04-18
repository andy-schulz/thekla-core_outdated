export interface WindowSize {
    width: number;
    height: number;
}

export interface BrowserWindow {
    setToPreset(): Promise<void>;
    setSize(dimension: WindowSize): Promise<void>;
    getSize(): Promise<WindowSize>;
    maximize(): Promise<void>;
}