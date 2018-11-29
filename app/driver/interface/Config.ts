export interface Config {
    browserName: string;
    serverUrl: string;
    baseUrl?: string
    chromeOptions?: ChromeOptions;
    firefoxOptions?: FirefoxOptions;
}

export interface ChromeOptions {
    binary?: string;
}
export interface FirefoxOptions {
    binary?: string;
    proxy?: ProxyConfig;
}

export interface ProxyConfig {
    proxyType: string;
    proxyAutoconfigUrl?: string;
    ftpProxy?: string;
    httpProxy?: string;
    sslProxy?: string;
    noProxy?: string;
    socksProxy?: string;
    socksUsername?: string;
    socksPassword?: string;
}