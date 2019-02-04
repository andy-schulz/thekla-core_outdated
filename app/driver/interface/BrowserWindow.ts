export interface WindowSize {
    width: number;
    height: number;
}

export interface BrowserWindow {
    setSize(dimension: WindowSize): Promise<void>;
    getSize(): Promise<WindowSize>;
    maximize(): Promise<void>;
}