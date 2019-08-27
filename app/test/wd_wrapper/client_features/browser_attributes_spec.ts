import * as _                                            from "lodash";
import {LogLevel}                                        from "../../../config/ServerConfig";
import {WindowSize}                                      from "../../../driver/interface/BrowserWindow";
import {ClientHelper, DesiredCapabilities, ServerConfig} from "../../../index";




describe(`creating a new Browser`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const conf: ServerConfig = {
        automationFramework: {
            type: process.env.FRAMEWORK  === `wdio` ? `wdio` : `wdjs`,
            logLevel:  (process.env.LOGLEVEL ? process.env.LOGLEVEL : `info`) as LogLevel
        },
        serverAddress: {
            hostname: process.env.SERVER_HOSTNAME ? process.env.SERVER_HOSTNAME : `localhost`
        },
    };

    const capabilities: DesiredCapabilities = {
        browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
    };

    const windowSize = function(): {} {
        return {width: window.innerWidth, height: window.innerHeight};
    };

    afterAll((): Promise<void[]> => {
        return ClientHelper.cleanup();
    });

    describe(`with an initial window setSize`, (): void => {

        afterEach((): Promise<void[]> => {
            return ClientHelper.cleanup()
        });

        it(`it should be maximized when the config contains the "maximum" attribute 
        - (test case id: 8a0d9a58-9591-43c1-89bb-d848319c90f1)`, async (): Promise<void> => {
            const con: ServerConfig = _.cloneDeep(conf);
            ((capabilities) as DesiredCapabilities).window = {
                setToMaxSize: true
            };

            const browserInitialResize = ClientHelper.create(con,capabilities);
            const data = await browserInitialResize.executeScript(windowSize);
            const dataParsed: WindowSize = JSON.parse(JSON.stringify(data));
            expect(dataParsed.height).toBeGreaterThanOrEqual(100);
            expect(dataParsed.width).toBeGreaterThanOrEqual(100);
        });

        it(`it should be maximized when maximize() is called after browser creation 
        - (test case id: 1473a628-0347-41d9-b2f8-2c93f827f840)`, async (): Promise<void> => {
            const browserManualResize = ClientHelper.create(conf,capabilities);
            const dataBefore = await browserManualResize.executeScript(windowSize);
            const dataBeforeParsed: WindowSize = JSON.parse(JSON.stringify(dataBefore));

            await browserManualResize.window.maximize();
            const dataAfter = await browserManualResize.executeScript(windowSize);
            const dataAfterParsed: WindowSize = JSON.parse(JSON.stringify(dataAfter));

            expect(dataAfterParsed.width).toBeGreaterThanOrEqual(dataBeforeParsed.width);
            expect(dataAfterParsed.height).toBeGreaterThanOrEqual(dataBeforeParsed.height)

        });

        describe(`and changing the window size`, (): void => {

            afterEach((): Promise<void[]> => {
                return ClientHelper.cleanup()
            });

            it(`should resize the window to 500x500 pixel 
            - (test case id: 1b7451ac-0ca2-4bdc-8700-60b4098d5829)`, async (): Promise<void> => {

                const browserResize = ClientHelper.create(conf, capabilities);
                await browserResize.window.setSize({width: 500, height: 500});
                expect((await browserResize.window.getSize()).width).toBeLessThan(550);
                expect((await browserResize.window.getSize()).width).toBeGreaterThanOrEqual(500);
                expect((await browserResize.window.getSize()).height).toBeLessThan(550);
                expect((await browserResize.window.getSize()).height).toBeGreaterThanOrEqual(500);

            });

        });
    });
});