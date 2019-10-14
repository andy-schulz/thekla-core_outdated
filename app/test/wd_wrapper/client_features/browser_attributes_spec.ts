import * as _                                                           from "lodash";
import {ClientHelper, DesiredCapabilities, ServerConfig, WindowSize}    from "../../..";
import {standardCapabilities, standardServerConfig}                     from "../../0_helper/config";

describe(`creating a new Browser`, (): void => {

    const conf: ServerConfig = _.cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = _.cloneDeep(standardCapabilities);

    const windowSize = function(): {} {
        return {width: window.innerWidth, height: window.innerHeight};
    };

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    afterEach((): Promise<void[]> => {
        return ClientHelper.cleanup()
    });

    describe(`with an initial window setSize`, (): void => {

        it(`it should be maximized when the config contains the "maximum" attribute 
        - (test case id: 8a0d9a58-9591-43c1-89bb-d848319c90f1)`, async (): Promise<void> => {
            const con: ServerConfig = _.cloneDeep(conf);
            const capa: DesiredCapabilities = _.cloneDeep(capabilities);

            capa.window = {
                setToMaxSize: true
            };

            const browserInitialResize = ClientHelper.create(con,capa);

            const data = await browserInitialResize.executeScript(windowSize);

            await new Promise((resolve) => setTimeout(resolve, 2000));

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

            it(`should resize the window to 500x500 pixel 
            - (test case id: 1b7451ac-0ca2-4bdc-8700-60b4098d5829)`, async (): Promise<void> => {
                const browserResize = ClientHelper.create(conf, capabilities);
                await browserResize.window.setSize({width: 500, height: 500});

                const size = await browserResize.window.getSize();

                expect(size.width).toBeLessThan(550);
                expect(size.width).toBeGreaterThanOrEqual(500);
                expect(size.height).toBeLessThan(550);
                expect(size.height).toBeGreaterThanOrEqual(500);
            });

        });
    });
});