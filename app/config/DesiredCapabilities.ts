/* eslint-disable quotes */
export interface DesiredCapabilities extends FirefoxOptions, ChromeOptions{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;

    // https://w3c.github.io/webdriver/#capabilities
    browserName?: string;
    browserVersion?: string;
    platformName?: string;
    acceptInsecureCerts?: boolean;
    pageLoadStrategy?: PageLoadStrategy;
    proxy?: ProxyConfig;
    timeout?: Timeouts;
    setWindowRect?: boolean;
    strictFileInteractability?: boolean;
    unhandledPromptBehavior?: boolean;

    window?: WindowConfig;

    appium?: AppiumOptions;

    "bstack:options"?: BrowserStackCapabilities;
}

//https://w3c.github.io/webdriver/#navigation
export type PageLoadStrategy = "none" | "eager" | "normal";

// https://w3c.github.io/webdriver/#timeouts
export interface Timeouts {
    script: number;
    pageLoad: number;
    implicit: number;
}

export interface AppiumOptions {
    [key: string]: any;
    deviceName?: string;
    udid?: string;
    app?: string;

    android?:  AppiumAndroidOptions;

    ios?: AppiumIOSOptions;
}

export interface AppiumAndroidOptions {
    appPackage?: string;
    appActivity?: string;
}

export interface AppiumIOSOptions {
    appName: string;
}

export interface FirefoxOptions {
    "moz:firefoxOptions"?: FirefoxBrowserOptions;
}

export interface ChromeOptions {
    "goog:chromeOptions"?: ChromeBrowserOptions;
}

export interface WindowConfig {
    /**
     * maximize the view port
     *
     * for chrome use options "--window-size=300,400" or "--start-maximized"
     * for firefox use options "--width=500" and "--height=500"
     */
    setToMaxSize: boolean;
}

/**
 * @property {string} binary        - Location of the Chrome Binary
 * @property {string[]} args        - command line argument to pass to chrome instance
 * @property {string[} profile      - path to the firefox profile
 * @property {object} log           - log object to increase the log level, default: info
 * @property {object} prefs         - preferense map with key name as name of preference and value as value of preference
 */
export interface ChromeBrowserOptions {
    binary?: string;
    args?: string[];
    prefs?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
}

/**
 * @property {string} binary        - Location of the Firefox Binary
 * @property {string[]} args        - command line argument to pass to firefox instance
 * @property {string[} profile      - path to the firefox profile
 * @property {object} log           - log object to increase the log level, default: info
 * @property {object} prefs         - preferense map with key name as name of preference and value as value of preference
 */
export interface FirefoxBrowserOptions {
    binary?: string;
    args?: string[];
    profile?: string;
    log?: {
        level: "trace" | "debug" | "config" | "info" | "warn" | "error" | "fatal";
    };
    prefs?: {
        [key: string]: string | boolean | number;
    };
}

export type ProxyType = "autodetect" | "direct" | "manual" | "pac" | "system"
export interface ProxyConfig {
    proxyType: ProxyType;
    proxyAutoconfigUrl?: string;
    ftpProxy?: string;
    httpProxy?: string;
    noProxy?: string;
    sslProxy?: string;
    socksProxy?: string;
    socksVersion?: string;
    // manualConfig?: ManualProxyConfig;
}

export interface ManualProxyConfig {
    default?: string;
    ftp?: string;
    http?: string;
    https?: string;
    bypass?: string[];
}

// see https://www.browserstack.com/automate/capabilities for details
export interface BrowserStackCapabilities {
    userName: string;
    accessKey: string;

    os?: "Windows" | "OS X";
    osVersion?: string;

    projectName?: string;
    buildName?: string;
    sessionName?: string;

    local?: boolean;
    video?: boolean;

    networkLogs?: boolean;
    seleniumVersion?: string;
}