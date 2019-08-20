import {DesiredCapabilities, ProxyConfig} from "../../../config/DesiredCapabilities";
import {ServerConfig}                     from "../../../config/ServerConfig";
import {Options}                          from "webdriver"
import * as fp                            from "lodash/fp"
import {curry}                            from "lodash"
import { ConfigurationNotImplemented } from "../../errors/ConfigurationNotImplemented";

const transformServerConfig = (serverConfig: ServerConfig): (option: Options) => Options => {
    return (options: Options): Options => {
        const opts = options;

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
const setBrowsername = curry((browsername: string | undefined, options: Options): Options => {
    if (browsername !== undefined && browsername !== null) {
        if(!options.capabilities)
            options.capabilities = {};
        options.capabilities.browserName = browsername;
    }
    return options
});

const setFirefoxOptions = curry((firefoxOptions: object | undefined, options: Options): Options => {
    if (firefoxOptions) {
        if(!options.capabilities)
            options.capabilities = {};
        options.capabilities[`moz:firefoxOptions`] = firefoxOptions;
    }

    return options;
});

const setChromeOptions = curry((chromeOptions: object | undefined, options: Options): Options => {

    if (chromeOptions) {
        if(!options.capabilities)
            options.capabilities = {};
        // @ts-ignore
        options.capabilities[`goog:chromeOptions`] = chromeOptions;
    }

    return options
});

const setProxy = curry((proxy: ProxyConfig | undefined, options: Options): Options => {
    if(proxy) {
        if(!options.capabilities)
            options.capabilities = {};
        if(!options.capabilities.proxy)
            options.capabilities.proxy = {};

        switch (proxy.type) {
            case `direct`:
                options.capabilities.proxy.proxyType = `noproxy`;
                break;
            case `system`:
                options.capabilities.proxy.proxyType = `system`;
                break;
            default:
                throw ConfigurationNotImplemented
                    .forFramework(`wdio`)
                    .andProperty(`capabilities.proxy.type`)
                    .withValue(proxy.type);


        }
    }

    return options

});

const transformCapabilities = (capabilities: DesiredCapabilities): (option: Options) => Options => {
    return (options: Options): Options => {
        return fp.flow(
            setBrowsername(capabilities.browserName),
            setFirefoxOptions(capabilities[`moz:firefoxOptions`]),
            setChromeOptions(capabilities[`goog:chromeOptions`]),
            setProxy(capabilities.proxy)
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


