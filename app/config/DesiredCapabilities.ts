export interface DesiredCapabilities {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;

    browserName: string;
    version?: string;


    proxy?: ProxyConfig;

    // eslint-disable-next-line quotes
    "moz:firefoxOptions"?: FirefoxOptions;
    // eslint-disable-next-line quotes
    "goog:chromeOptions"?: ChromeOptions;

    window?: WindowConfig;

}


export interface WindowConfig {
    /**
     * maximize the view port
     *
     * for chrome use options "--window-size=300,400" or "--start-maximized"
     * for firefox use options "--width=500" and "--height=500"
     */
    setToMaxSize: true;
}


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
export interface FirefoxOptions {
    binary?: string;
    args?: string[];
    profile?: string;
    log?: {
        // eslint-disable-next-line quotes
        level: "trace" | "debug" | "config" | "info" | "warn" | "error" | "fatal";
    };
    prefs?: {
        [key: string]: string | boolean | number;
    };

}

export interface ProxyConfig {
    // eslint-disable-next-line quotes
    type: "direct" | "system" | "manual";
    manualConfig?: ManualProxyConfig;
}

export interface ManualProxyConfig {
    default?: string;
    ftp?: string;
    http?: string;
    https?: string;
    bypass?: string[];
}