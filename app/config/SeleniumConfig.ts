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

    "moz:firefoxOptions"?: FirefoxOptions;
    "goog:chromeOptions"?: ChromeOptions;

    window?: WindowConfig

}

export interface WindowConfig {
    /**
     * maximize the view port
     *
     * for chrome use options "--window-size=300,400" or "--start-maximized"
     * for firefox use options "--width=500" and "--height=500"
     */
    setToMaxSize: true
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

/**
 * @property {string} binary        - Location of the Chrome Binary
 * @property {string[]} args        - command line argument to pass to chrome instance
 * @property {string[} profile      - path to the firefox profile
 * @property {object} log           - log object to increase the log level, default: info
 * @property {object} prefs         - preferense map with key name as name of preference and value as value of preference
 */
export interface ChromeOptions {
    binary?: string;
    args?: string[];
    prefs?: {
        [key: string]: any
    };
}

/**
 * @property {string} binary        - Location of the Firefox Binary
 * @property {string[]} args        - command line argument to pass to firefox instance
 * @property {string[} profile      - path to the firefox profile
 * @property {object} log           - log object to increase the log level, default: info
 * @property {object} prefs         - preferense map with key name as name of preference and value as value of preference
 */
export interface FirefoxOptions {
    binary?: string;
    args?: string[];
    profile?: string;
    log?: {
        level: "trace" | "debug" | "config" | "info" | "warn" | "error" | "fatal"
    }
    prefs?: {
        [key: string]: string | boolean | number
    }

}