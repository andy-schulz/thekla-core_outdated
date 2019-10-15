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
    standardCapabilities[`bstack:options`] = {
        userName: process.env.CLOUD_USER ? process.env.CLOUD_USER : `fail`,
        accessKey: process.env.CLOUD_KEY ? process.env.CLOUD_KEY : `fail`,

        os: `Windows`,
        osVersion: `10`,

        projectName: `Thekla`,
        buildName: `${moment().format(`YYYY-MM-DD HH:mm:ss`)}`,
        video: false,
        seleniumVersion: `3.141.59`
    };
}

export const setBrowserStackSessionName = (capabilities: DesiredCapabilities, name: string): void => {
    if(process.env.BROWSERSTACK === `enabled`)
        set(capabilities,`bstack:options.sessionName` ,name);
};