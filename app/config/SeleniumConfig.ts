export interface SeleniumConfig {
    seleniumServerAddress: string;
    capabilities: BrowserCapabilities | CapabilitiesFunction;

    baseUrl?: string;
    multiBrowserTest?: boolean;
}

export type CapabilitiesFunction = () => BrowserCapabilities

export interface BrowserCapabilities {
    [key: string]: any;

    browserName: string;
    version?: string;


    proxy?: ProxyConfig;

    firefoxConfig?: FirefoxOptions;
    chromeConfig?: ChromeOptions;
}

export interface ProxyConfig {
    type: "direct" | "system" | "manual";
    manualConfig?: ManualProxyConfig;
}
export interface ManualProxyConfig {
    default?: string;
    ftp?: string;
    http?: string;
    https?: string;
    bypass?: string[]
}

export interface RestConfig {}

export interface ChromeOptions {
    binary?: string;
}
export interface FirefoxOptions {
    binary?: string;
}