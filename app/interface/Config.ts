export interface Config {
    browserName: string;
    serverUrl: string;
    chromeOptions?: ChromeOptions;
    firefoxOptions?: FirefoxOptions;
}

export interface ChromeOptions {
    binary?: string;
}
export interface FirefoxOptions {
    binary?: string;
}