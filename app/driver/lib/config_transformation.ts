import {DesiredCapabilities} from "../../config/DesiredCapabilities";
import {ServerConfig}        from "../../config/ServerConfig";
import {Options} from "webdriver"
import * as fp from "lodash/fp"

const transformServerConfig = (serverConfig: ServerConfig): (option: Options) => Options => {
    return (options: Options): Options => {
        const opts = options;

        if(!serverConfig.serverAddress)
            return opts;

        if(serverConfig.serverAddress.hostname !== undefined && serverConfig.serverAddress.hostname !== null)
            opts.hostname = serverConfig.serverAddress.hostname;

        if(serverConfig.serverAddress.protocol !== undefined && serverConfig.serverAddress.protocol !== null)
            opts.protocol = serverConfig.serverAddress.protocol;

        if(serverConfig.serverAddress.port !== undefined && serverConfig.serverAddress.port !== null)
            opts.port = serverConfig.serverAddress.port;

        if(serverConfig.serverAddress.path !== undefined && serverConfig.serverAddress.path !== null)
            opts.path = serverConfig.serverAddress.path;

        return opts;
    }
};

const transformCapabilities = (capabilities: DesiredCapabilities): (option: Options) => Options => {
    return (options: Options): Options => {
        const opts = options;

        opts.capabilities = {};

        if(capabilities.browserName !== undefined && capabilities.browserName !== null)
            opts.capabilities.browserName = capabilities.browserName;

        return opts
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


