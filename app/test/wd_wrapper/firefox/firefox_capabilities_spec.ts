import {cloneDeep}                                                                from "lodash";
import {Browser, ClientHelper, DesiredCapabilities, RunningBrowser, ServerConfig} from "../../..";
import {WindowSize}                                                               from "../../../driver/interface/BrowserWindow";
import {setBrowserStackSessionName, standardCapabilities, standardServerConfig}   from "../../0_helper/config";

describe(`Starting a browser instance`, (): void => {

    const conf: ServerConfig = cloneDeep(standardServerConfig);
    const capabilities = cloneDeep(standardCapabilities);
    capabilities.browserName = `firefox`;
    setBrowserStackSessionName(capabilities, `firefox_capabilities_spec.ts`);

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

    describe(`by passing the browser name as a capabilities object`, (): void => {

        afterEach((): Promise<void[]> => {
            return RunningBrowser.cleanup();
        });

        it(`should get the user agent for a firefox browser 
        - (test case id: 57480387-ed1c-43ca-8da0-0767e57d106b)`, async (): Promise<void> => {

            const browser: Browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            const agent = await browser.executeScript(browserFunc);
            expect(agent).toContain(`Firefox`);
        });
    });

    describe(`and passing view port information as command line arguments`, (): void => {

        it(`it should change the viewport for the firefox browser instance
        - (test case id: cd50ddb6-95d5-4111-ac92-e0d92dea2953)`, async (): Promise<void> => {
            const capa: DesiredCapabilities = cloneDeep(capabilities);
            (capa)[`moz:firefoxOptions`] = {
                args: [`--width=2200`, `--height=2200`]
            };

            const browserInitialResize = ClientHelper.create(conf, capa);
            const data = await browserInitialResize.executeScript(windowSize);
            const dataParsed: WindowSize = JSON.parse(JSON.stringify(data));
            expect(dataParsed.height).toBeGreaterThanOrEqual(1000);
            expect(dataParsed.width).toBeGreaterThanOrEqual(1000);
        });
    });

    describe(`and passing browser binary information`, (): void => {
        it(`should evaluate the binary for a firefox instance
            - (test case id: b11e0c91-b84f-4ae3-b08d-7b8dad6d6c74)`, async (): Promise<void> => {

            const capa: DesiredCapabilities = cloneDeep(capabilities);
            capa[`moz:firefoxOptions`] = {
                binary: `C:\\DoesNotExist`
            };

            return RunningBrowser.startedOn(conf).withCapabilities(capa)
                .get(`/`)
                .then((): Promise<void> => {
                    if (process.env.BROWSERSTACK === `enabled`)
                        return Promise.resolve(); // browserstack ignores the binary option and just opens the browser

                    return Promise.reject(`creating a browser with a not existing binary should throw an Error, but it doesnt`);
                })
                .catch((e: Error): void => {
                    expect(e.toString()).toContain(`Failed to start browser`);
                    expect(e.toString()).toContain(`C:\\DoesNotExist: no such file or directory`);
                });
        });
    });
});