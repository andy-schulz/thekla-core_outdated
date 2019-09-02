import * as _                                                                     from "lodash";
import {Browser, ClientHelper, DesiredCapabilities, RunningBrowser, ServerConfig} from "../../..";
import {LogLevel}                                                                 from "../../../config/ServerConfig";
import {WindowSize}                                                               from "../../../driver/interface/BrowserWindow";
import {standardServerConfig}                                                     from "../../0_helper/config";

describe(`Starting a browser instance`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const conf: ServerConfig =  _.cloneDeep(standardServerConfig);

    const capabilities: DesiredCapabilities ={
        browserName: `firefox`
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

    describe(`by passing the browser name as a capabilities object`, (): void => {

        afterEach((): Promise<void[]> => {
            return RunningBrowser.cleanup();
        });

        it(`should start a firefox instance when the browsername is "firefox" ` +
            `- (test case id: 57480387-ed1c-43ca-8da0-0767e57d106b)`, async (): Promise<void> => {

            const browser: Browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            const agent = await browser.executeScript(browserFunc);
            expect(agent).toContain(`Firefox`);
        });
    });

    describe(`and passing view port information as command line arguments`, (): void => {

        it(`it should change the viewport for the firefox browser instance` +
            `- (test case id: cd50ddb6-95d5-4111-ac92-e0d92dea2953)`, async (): Promise<void> => {
            const con = conf;
            const capa: DesiredCapabilities = _.cloneDeep(capabilities);
            (capa)[`moz:firefoxOptions`] = {
                args: [`--width=2200`, `--height=2200`]
            };

            const browserInitialResize = ClientHelper.create(con, capa);
            const data = await browserInitialResize.executeScript(windowSize);
            const dataParsed: WindowSize = JSON.parse(JSON.stringify(data));
            expect(dataParsed.height).toBeGreaterThanOrEqual(2000);
            expect(dataParsed.width).toBeGreaterThanOrEqual(2000);
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
                    hostname: process.env.SERVER_HOSTNAME ? process.env.SERVER_HOSTNAME : `localhost`
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
                .catch((e: Error): void => {
                    expect(e.toString()).toContain(`Failed to start browser`);
                    expect(e.toString()).toContain(`C:\\DoesNotExist: no such file or directory`);
                });
        });
    });
});