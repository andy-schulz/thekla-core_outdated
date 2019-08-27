import {DesiredCapabilities}    from "../../../config/DesiredCapabilities";
import {LogLevel, ServerConfig} from "../../../config/ServerConfig";
import {Browser}                from "../../../driver/interface/Browser";
import {ClientHelper}           from "../../../driver/lib/client/ClientHelper";

describe(`Using the BrowserWdjs class`, () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const conf: ServerConfig = {
        automationFramework: {
            type: process.env.FRAMEWORK === `wdio` ? `wdio` : `wdjs`,
            logLevel:  (process.env.LOGLEVEL ? process.env.LOGLEVEL : `info`) as LogLevel
        },
        serverAddress: {
            hostname: process.env.SERVER_HOSTNAME ? process.env.SERVER_HOSTNAME : `localhost`
        },
        baseUrl: process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`
    };

    const capabilities: DesiredCapabilities = {
        browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `firefox`,
        proxy: process.env.PROXY_TYPE === `manual` ? {
            proxyType: `manual`,
            httpProxy: process.env.PROXY_SERVER,
            sslProxy: process.env.PROXY_SERVER,
        } : {
            proxyType: `system`
        }
    };

    describe(`and work with the title`, (): void => {
        let browser: Browser;

        beforeAll( (): void => {
            browser = ClientHelper.create(conf, capabilities);
        });

        beforeEach( (): Promise<void> => {
            return  browser.get(`/`);
        });

        it(`the getTitle method should get the correct title 
        - (test case id: 69c764e0-ad69-4bdf-b2a1-fd259ea57d04)`, async (): Promise<void> => {
            expect(await browser.getTitle()).toEqual(`React App`);
        });

        it(`the hasTitle method should test for the correct title 
        - (test case id: 32a63a6a-cd0d-43e8-8806-3f4a9b07614d)`, async (): Promise<void> => {
            expect(await browser.hasTitle(`React App`)).toEqual(true);
        });

        it(`the hasTitle method should return false when the given title is not correct. 
        - (test case id: 03314fd1-dd48-474c-be45-7360853c3ff5)`, async (): Promise<void> => {
            expect(await browser.hasTitle(`ReactApp`)).toEqual(false);
        });
    });

    afterAll(async (): Promise<void[]> => {
        return ClientHelper.cleanup();
    })
});