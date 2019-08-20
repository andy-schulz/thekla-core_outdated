import * as _                                                                     from "lodash";
import {Browser, ClientHelper, DesiredCapabilities, RunningBrowser, ServerConfig} from "../..";
import {LogLevel}                                                                 from "../../config/ServerConfig";
import {WindowSize}                                                               from "../../driver/interface/BrowserWindow";

describe(`Starting a browser instance`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const conf: ServerConfig =  {
        automationFramework: {
            type: process.env.FRAMEWORK === `wdio` ? `wdio` : `wdjs`,
            logLevel:  (process.env.LOGLEVEL ? process.env.LOGLEVEL : `info`) as LogLevel
        },
        serverAddress: {
            hostname: `localhost`
        },
    };

    const capabilities: DesiredCapabilities ={
        browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `firefox`
    };

    const windowSize = function(): {width: number; height: number} {
        return {width: window.innerWidth, height: window.innerHeight};
    };

    const browserFunc = (): string => {
        return navigator.userAgent;
    };

    afterAll(async (): Promise<void[][]> => {
        return ClientHelper.cleanup();
    });

    describe(`by passing the browser name as a capabilities object`, (): void => {

        it(`should start a firefox instance when the browsername is "firefox" ` +
            `- (test case id: 57480387-ed1c-43ca-8da0-0767e57d106b)`, async (): Promise<void> => {
            const capa: DesiredCapabilities = _.cloneDeep(capabilities);
            capa.browserName = `firefox`;

            const browser: Browser = RunningBrowser.startedOn(conf).withCapabilities(capa);
            const agent = await browser.executeScript(browserFunc);
            expect(agent).toContain(`Firefox`);
        });

        it(`should start a firefox instance when the browsername is "chrome" ` +
            `- (test case id: 6936a711-f3e6-404b-aa56-94972567f8bd)`, async (): Promise<void> => {
            const capa: DesiredCapabilities = _.cloneDeep(capabilities);
            capa.browserName = `chrome`;

            const browser: Browser = RunningBrowser.startedOn(conf).withCapabilities(capa);
            const agent = await browser.executeScript(browserFunc);
            expect(agent).toContain(`Chrome`);
        });
    });

    describe(`and passing view port information as command line arguments`, (): void => {

        it(`it should change the viewport for the firefox browser instance` +
            `- (test case id: cd50ddb6-95d5-4111-ac92-e0d92dea2953)`, async (): Promise<void> => {
            const con = conf;
            const capa: DesiredCapabilities = _.cloneDeep(capabilities);
            capa.browserName = `firefox`;
            (capa)[`moz:firefoxOptions`] = {
                args: [`--width=2200`, `--height=2200`]
            };

            const browserInitialResize = ClientHelper.create(con, capa);
            const data = await browserInitialResize.executeScript(windowSize);
            const dataParsed: WindowSize = JSON.parse(JSON.stringify(data));
            expect(dataParsed.height).toBeGreaterThanOrEqual(2000);
            expect(dataParsed.width).toBeGreaterThanOrEqual(2000);
        });

        it(`it should change the viewport for the chrome browser instance` +
            `- (test case id: ff147acf-a7fd-4297-9d3d-addd4ab7b883)`, async (): Promise<void> => {
            const con: ServerConfig = _.cloneDeep(conf);
            const capa: DesiredCapabilities = _.cloneDeep(capabilities);
            capa[`goog:chromeOptions`] = {
                args: [`--window-size=500,500`]
            };
            capa.browserName = `chrome`;

            const browserInitialResize = ClientHelper.create(con, capa);
            const data = await browserInitialResize.executeScript(windowSize);
            const dataParsed: WindowSize = JSON.parse(JSON.stringify(data));
            expect(dataParsed.height).toBeLessThanOrEqual(510);
            expect(dataParsed.width).toBeLessThanOrEqual(510);
        });
    });

    describe(`and passing browser binary information`, (): void => {
        it(`should evaluate the binary for a firefox instance` +
            `- (test case id: b11e0c91-b84f-4ae3-b08d-7b8dad6d6c74)`, async (): Promise<void> => {
            const conf: ServerConfig =  {
                automationFramework: {
                    type: process.env.FRAMEWORK === `wdio` ? `wdio` : `wdjs`,
                    logLevel: (process.env.LOGLEVEL ? process.env.LOGLEVEL : `warn`) as LogLevel
                },
                serverAddress: {
                    hostname: `localhost`
                },
                baseUrl: process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`
            };

            const capa: DesiredCapabilities = {
                browserName: `firefox`,
                "moz:firefoxOptions": {
                    binary: `C:\\DoesNotExist`
                }
            };

            return RunningBrowser.startedOn(conf).withCapabilities(capa)
                .get(`/`)
                .then((): Promise<void> => {
                    return Promise.reject(`creating a browser with a not existing binary should throw an Error, but it doesnt`);
                })
                .catch((e): void => {
                    expect(e.toString()).toContain(`Failed to start browser`);
                    expect(e.toString()).toContain(`C:\\DoesNotExist: no such file or directory`);
                });
        });

        it(`should evaluate the binary for a chrome instance` +
            `- (test case id: 052dcc2d-38d2-4a5d-9dea-87b29302c445)`, async (): Promise<void> => {
            const seleniumConfig: ServerConfig =  {
                automationFramework: {
                    type: process.env.FRAMEWORK === `wdio` ? `wdio` : `wdjs`,
                    logLevel: (process.env.LOGLEVEL ? process.env.LOGLEVEL : `warn`) as LogLevel
                },
                serverAddress: {
                    hostname: `localhost`
                },
                baseUrl: process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`
            };

            const capabilities: DesiredCapabilities = {
                browserName: `chrome`,
                "goog:chromeOptions": {
                    binary: `C:\\DoesNotExist`
                }
            };

            return RunningBrowser.startedOn(seleniumConfig).withCapabilities(capabilities)
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