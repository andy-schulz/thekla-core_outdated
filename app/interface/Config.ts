export interface Config {
    browserName: string;
    serverUrl: string;
    chromeOptions?: ChromeOptions;
}

export interface ChromeOptions {
    binary?: string;
}