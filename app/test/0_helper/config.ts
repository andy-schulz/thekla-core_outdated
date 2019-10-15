import {DesiredCapabilities}    from "../../config/DesiredCapabilities";
import {LogLevel, ServerConfig} from "../../config/ServerConfig";
import moment                   from "moment"
import {set}                    from "lodash"

export const standardServerConfig: ServerConfig = {
    automationFramework: {
        logLevel: (process.env.LOGLEVEL ? process.env.LOGLEVEL : `info`) as LogLevel
    },
    serverAddress: {
        hostname: process.env.SERVER_HOSTNAME ? process.env.SERVER_HOSTNAME : `localhost`
    },

    baseUrl: process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`,
    annotateElement: false
};
if (process.env.BASEURL) standardServerConfig.baseUrl = process.env.BASEURL;

export const standardCapabilities: DesiredCapabilities = {
    browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
    proxy: process.env.PROXY_TYPE === `manual` ? {
        proxyType: `manual`,
        httpProxy: process.env.PROXY_SERVER,
        sslProxy: process.env.PROXY_SERVER,
    } : {
        proxyType: `system`
    }
};

// browserstack options
if (process.env.BROWSERSTACK === `enabled`) {
    standardCapabilities.browserStack = {
        user: process.env.CLOUD_USER ? process.env.CLOUD_USER : `fail`,
        key: process.env.CLOUD_KEY ? process.env.CLOUD_KEY : `fail`,

        project: `Thekla`,
        build: `${moment().format(`YYYY-MM-DD HH:mm:ss`)}`,
        video: false,
    };
}

export const setBrowserStackName = (capabilities: DesiredCapabilities, name: string): void => {
    if(process.env.BROWSERSTACK === `enabled`)
        set(capabilities,`browserStack.name` ,name);
};