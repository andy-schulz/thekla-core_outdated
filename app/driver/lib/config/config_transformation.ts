import {AppiumOptions, DesiredCapabilities, ProxyConfig} from "../../../config/DesiredCapabilities";
import {ServerConfig}                                    from "../../../config/ServerConfig";
import {Options}                                         from "webdriver"
import * as fp                                           from "lodash/fp"
import {curry, set, transform}                               from "lodash"
import deepmerge                                         from "deepmerge";

const transformServerConfig = (serverConfig: ServerConfig): (option: Options) => Options => {
    return (options: Options): Options => {
        const opts = options;

        if(serverConfig.user)
            opts.user = serverConfig.user;

        if(serverConfig.key)
            opts.key = serverConfig.key;

        if (!serverConfig.serverAddress)
            return opts;

        if (serverConfig.serverAddress.hostname !== undefined && serverConfig.serverAddress.hostname !== null)
            opts.hostname = serverConfig.serverAddress.hostname;

        if (serverConfig.serverAddress.protocol !== undefined && serverConfig.serverAddress.protocol !== null)
            opts.protocol = serverConfig.serverAddress.protocol;

        if (serverConfig.serverAddress.port !== undefined && serverConfig.serverAddress.port !== null)
            opts.port = serverConfig.serverAddress.port;

        if (serverConfig.serverAddress.path !== undefined && serverConfig.serverAddress.path !== null)
            opts.path = serverConfig.serverAddress.path;

        if (serverConfig.automationFramework && serverConfig.automationFramework.logLevel)
            opts.logLevel = serverConfig.automationFramework.logLevel;

        return opts;
    }
};
const setMainProperties = curry((capabilities: DesiredCapabilities | undefined, options: Options): Options => {
    if(!capabilities)
        return options;
    return transform(capabilities, (acc: Options, value: any, key: string) => {
        if(typeof value !== `object`) {
            set(acc, `capabilities["${key}"]`, value)
        }
    }, options);
});

const setFirefoxOptions = curry((firefoxOptions: object | undefined, options: Options): Options => {
    if (firefoxOptions) {
        return set(options, `capabilities["moz:firefoxOptions"]`, firefoxOptions)
    }
    return options;
});

const setChromeOptions = curry((chromeOptions: object | undefined, options: Options): Options => {

    if (chromeOptions) {
        return set(options, `capabilities["goog:chromeOptions"]`, chromeOptions)
    }
    return options
});

const setProxy = curry((proxy: ProxyConfig | undefined, options: Options): Options => {
    if (proxy) {
        const p = deepmerge({}, proxy);
        set(options, `capabilities.proxy`, p);
    }
    return options
});

const setAppiumOptions = curry((appiumOptions: AppiumOptions | undefined, options: Options): Options => {
    if(!appiumOptions)
        return options;
    return transform(appiumOptions, (acc, value, key) => {
        if(key === `android`) {
            return transform(appiumOptions.android as object,(acc: Options, value: any, key: string): void => {
                set(acc,`capabilities[${key}]`, value);
            }, acc);
        }

        if(key === `ios`)
            return transform(appiumOptions.ios as object,(acc: Options, value: any, key: string) => {
                set(acc,`capabilities[${key}]`, value);
            }, acc);

        set(acc,`capabilities[${key}]`, value);

    }, options)
});

const transformCapabilities = (capabilities: DesiredCapabilities): (option: Options) => Options => {
    return (options: Options): Options => {
        return fp.flow(
            setMainProperties(capabilities),
            setFirefoxOptions(capabilities[`moz:firefoxOptions`]),
            setChromeOptions(capabilities[`goog:chromeOptions`]),
            setProxy(capabilities.proxy),
            setAppiumOptions(capabilities.appium)
        )(options);
    }
};


export const transformToWdioConfig =
    (serverConfig: ServerConfig, capabilities: DesiredCapabilities): Options => {
        let options: Options = {};

        return fp.flow(
            transformServerConfig(serverConfig),
            transformCapabilities(capabilities)
        )(options);
    };


