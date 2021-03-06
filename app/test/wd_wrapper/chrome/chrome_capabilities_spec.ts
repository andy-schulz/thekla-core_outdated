import {cloneDeep}                                                                from "lodash";
import {Browser, ClientHelper, DesiredCapabilities, RunningBrowser, ServerConfig} from "../../../index";
import {WindowSize}                                                               from "../../../driver/interface/BrowserWindow";
import {standardCapabilities, standardServerConfig, setBrowserStackSessionName}   from "../../0_helper/config";

describe(`Starting a browser instance`, (): void => {

    const conf: ServerConfig = cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = cloneDeep(standardCapabilities);
    setBrowserStackSessionName(capabilities, `chrome_capabilities_spec.ts`);
    capabilities.browserName = `chrome`;

    const windowSize = function (): { width: number; height: number } {
        return {width: window.innerWidth, height: window.innerHeight};
    };

    const browserFunc = (): string => {
        return navigator.userAgent;
    };

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    afterEach(async (): Promise<void[]> => {
        return ClientHelper.cleanup();
    });

    afterAll(async (): Promise<void[]> => {
        return ClientHelper.cleanup();
    });

    describe(`by passing the browser name as a capabilities object`, (): void => {

        it(`should get the user agent for a chrome browser 
        - (test case id: 2e6b37af-c7e7-4cba-8959-082ae97e4084)`, async (): Promise<void> => {

            const browser: Browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            const agent = await browser.executeScript(browserFunc);
            expect(agent).toContain(`Chrome`);
        });
    });

    describe(`and passing view port information as command line arguments`, (): void => {

        it(`it should change the viewport for the chrome browser instance
        - (test case id: 3286d22d-3ba7-4201-acd6-503a39bc555c)`, async (): Promise<void> => {
            const capa: DesiredCapabilities = cloneDeep(capabilities);
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

        it(`should evaluate the binary for a chrome instance
        - (test case id: dda17db2-96f9-4cdf-a7df-f760158aea18)`, async (): Promise<void> => {
            const caps: DesiredCapabilities = cloneDeep(capabilities);
            caps[`goog:chromeOptions`] = {
                binary: `C:\\DoesNotExist`
            };

            return RunningBrowser.startedOn(conf).withCapabilities(caps)
                .get(`/`)
                .then((): Promise<void> => {
                    if (process.env.BROWSERSTACK === `enabled`) // browserstack ignores the binary option and just opens the browser
                        return Promise.resolve();

                    return Promise.reject(`creating a browser with a not existing binary should throw an Error, but it doesnt`);
                })
                .catch((e): void => {
                    expect(e.toString()).toContain(`unknown error: no chrome binary at C:\\DoesNotExist`);
                });
        });
    });
});