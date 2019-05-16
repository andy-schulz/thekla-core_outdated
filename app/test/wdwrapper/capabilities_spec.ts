import * as _                                                         from "lodash";
import {Browser, DesiredCapabilities, RunningBrowser, SeleniumConfig} from "../..";
import {WindowSize}                                                   from "../../driver/interface/BrowserWindow";
import {BrowserWdjs}                                                  from "../../driver/wdjs/BrowserWdjs";

describe(`Starting a browser instance`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const conf: SeleniumConfig =  {
        seleniumServerAddress: `http://localhost:4444/wd/hub`,
    };

    const capabilities: DesiredCapabilities ={
        browserName: `firefox`
    };

    const windowSize = function(): {width: number; height: number} {
        return {width: window.innerWidth, height: window.innerHeight};
    };

    const browserFunc = (): string => {
        return navigator.userAgent;
    };

    afterAll(async (): Promise<void> => {
        await RunningBrowser.cleanup();
    });

    describe(`by passing the browser name as a capabilities object`, () => {
        it(`should start a firefox instance when the browsername is "firefox" ` +
            `- (test case id: 57480387-ed1c-43ca-8da0-0767e57d106b)`, async () => {

            const browser: Browser = RunningBrowser.startedOn(conf).withDesiredCapability(capabilities);
            const agent = await browser.executeScript(browserFunc);
            expect(agent).toContain(`Firefox`);
        });

        it(`should start a firefox instance when the browsername is "chrome" ` +
            `- (test case id: 6936a711-f3e6-404b-aa56-94972567f8bd)`, async () => {
            const capa: DesiredCapabilities = _.cloneDeep(capabilities);
            capa.browserName = `chrome`;
            const browser: Browser = RunningBrowser.startedOn(conf).withDesiredCapability(capa);
            const agent = await browser.executeScript(browserFunc);
            expect(agent).toContain(`Chrome`);
        });
    });

    describe(`and passing view port information as command line arguments`, () => {
        it(`it should change the viewport for the firefox browser instance` +
            `- (test case id: 8a0d9a58-9591-43c1-89bb-d848319c90f1)`, async () => {
            const con = conf;
            const capa: DesiredCapabilities = _.cloneDeep(capabilities);
            (capa)[`moz:firefoxOptions`] = {
                args: [`--width=2200`, `--height=2200`]
            };

            const browserInitialResize = BrowserWdjs.create(con, capa);
            const data = await browserInitialResize.executeScript(windowSize);
            const dataParsed: WindowSize = JSON.parse(JSON.stringify(data));
            expect(dataParsed.height).toBeGreaterThanOrEqual(2000);
            expect(dataParsed.width).toBeGreaterThanOrEqual(2000);
        });

        it(`it should change the viewport for the chrome browser instance` +
            `- (test case id: ff147acf-a7fd-4297-9d3d-addd4ab7b883)`, async () => {
            const con: SeleniumConfig = _.cloneDeep(conf);
            const capa: DesiredCapabilities = _.cloneDeep(capabilities);
            capa[`goog:chromeOptions`] = {
                args: [`--window-size=500,500`]
            };
            capa.browserName = `chrome`;

            const browserInitialResize = BrowserWdjs.create(con, capa);
            const data = await browserInitialResize.executeScript(windowSize);
            const dataParsed: WindowSize = JSON.parse(JSON.stringify(data));
            expect(dataParsed.height).toBeLessThanOrEqual(500);
            expect(dataParsed.width).toBeLessThanOrEqual(500);
        });
    });

    describe(`and passing browser binary information`, () => {
        it(`should evaluate the binary for a firefox instance` +
            `- (test case id: b11e0c91-b84f-4ae3-b08d-7b8dad6d6c74)`, async () => {
            const conf: SeleniumConfig =  {
                seleniumServerAddress: `http://localhost:4444/wd/hub`,
            };

            const capa: DesiredCapabilities = {
                browserName: `firefox`,
                "moz:firefoxOptions": {
                    binary: `C:\\DoesNotExist`
                }
            };

            return RunningBrowser.startedOn(conf).withDesiredCapability(capa).get(`http://localhost:3000`)
                .then((): Promise<void> => {
                    return Promise.reject(`creating a browser with a not existing binary should throw an Error, but it doesnt`);
                })
                .catch((e): void => {
                    expect(e.toString()).toContain(`Failed to start browser`);
                    expect(e.toString()).toContain(`C:\\DoesNotExist: no such file or directory`);
                });
        });

        it(`should evaluate the binary for a chrome instance` +
            `- (test case id: b11e0c91-b84f-4ae3-b08d-7b8dad6d6c74)`, async () => {
            const seleniumConfig: SeleniumConfig =  {
                seleniumServerAddress: `http://localhost:4444/wd/hub`,
            };

            const capabilities: DesiredCapabilities = {
                browserName: `chrome`,
                "goog:chromeOptions": {
                    binary: `C:\\DoesNotExist`
                }
            };

            return RunningBrowser.startedOn(seleniumConfig).withDesiredCapability(capabilities).get(`http://locahost:3000`)
                .then((): Promise<void> => {
                    return Promise.reject(`creating a browser with a not existing binary should throw an Error, but it doesnt`);
                })
                .catch((e): void => {
                    expect(e.toString()).toContain(`WebDriverError: unknown error: no chrome binary at C:\\DoesNotExist`);
                });
        });
    });
});