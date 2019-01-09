
export interface CapabilitiesWdjs {
    browserName: string;
    serverUrl: string;
    baseUrl?: string
    chromeOptions?: ChromeOptions;
    firefoxOptions?: FirefoxOptions;
    proxy?: ProxyConfig
}

export interface ChromeOptions {
    binary?: string;
}
export interface FirefoxOptions {
    binary?: string;
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