import * as _                                                                     from "lodash";
import {Browser, ClientHelper, DesiredCapabilities, RunningBrowser, ServerConfig} from "../../../index";
import { LogLevel } from "../../../config/ServerConfig";
import { WindowSize } from "../../../driver/interface/BrowserWindow";

describe(`Starting a browser instance`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const conf: ServerConfig =  {
        automationFramework: {
            type: process.env.FRAMEWORK === `wdio` ? `wdio` : `wdjs`,
            logLevel:  (process.env.LOGLEVEL ? process.env.LOGLEVEL : `info`) as LogLevel
        },
        serverAddress: {
            hostname: process.env.SERVER_HOSTNAME ? process.env.SERVER_HOSTNAME : `localhost`
        },
        baseUrl: process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`
    };

    const capabilities: DesiredCapabilities ={
        browserName: `chrome`,
        proxy: process.env.PROXY_TYPE === `manual` ? {
            proxyType: `manual`,
            httpProxy: process.env.PROXY_SERVER,
            sslProxy: process.env.PROXY_SERVER,
        } : {
            proxyType: `system`
        }
    };

    const windowSize = function(): {width: number; height: number} {
        return {width: window.innerWidth, height: window.innerHeight};
    };

    const browserFunc = (): string => {
        return navigator.userAgent;
    };

    afterEach(async (): Promise<void[]> => {
        return ClientHelper.cleanup();
    });

    afterAll(async (): Promise<void[]> => {
        return ClientHelper.cleanup();
    });

    describe(`by passing the browser name as a capabilities object`, (): void => {

        it(`should start a firefox instance when the browsername is "chrome" ` +
            `- (test case id: 2e6b37af-c7e7-4cba-8959-082ae97e4084)`, async (): Promise<void> => {
            const capa: DesiredCapabilities = _.cloneDeep(capabilities);
            capa.browserName = `chrome`;

            const browser: Browser = RunningBrowser.startedOn(conf).withCapabilities(capa);
            const agent = await browser.executeScript(browserFunc);
            expect(agent).toContain(`Chrome`);
        });
    });

    describe(`and passing view port information as command line arguments`, (): void => {

        it(`it should change the viewport for the chrome browser instance` +
            `- (test case id: 3286d22d-3ba7-4201-acd6-503a39bc555c)`, async (): Promise<void> => {
            const capa: DesiredCapabilities = _.cloneDeep(capabilities);
            capa[`goog:chromeOptions`] = {
                args: [`--window-size=500,500`]
            };

            const browserInitialResize = ClientHelper.create(conf, capa);
            const data = await browserInitialResize.executeScript(windowSize);
            const dataParsed: WindowSize = JSON.parse(JSON.stringify(data));
            expect(dataParsed.height).toBeLessThanOrEqual(510);
            expect(dataParsed.width).toBeLessThanOrEqual(510);
        });
    });

    describe(`and passing browser binary information`, (): void => {
        it(`should evaluate the binary for a chrome instance` +
            `- (test case id: dda17db2-96f9-4cdf-a7df-f760158aea18)`, async (): Promise<void> => {
            const caps: DesiredCapabilities = _.cloneDeep(capabilities);
            caps[`goog:chromeOptions`] = {
                binary: `C:\\DoesNotExist`
            };

            return RunningBrowser.startedOn(conf).withCapabilities(caps)
                .get(`/`)
                .then((): Promise<void> => {
                    return Promise.reject(`creating a browser with a not existing binary should throw an Error, but it doesnt`);
                })
                .catch((e): void => {
                    expect(e.toString()).toContain(`unknown error: no chrome binary at C:\\DoesNotExist`);
                });
        });
    });
});