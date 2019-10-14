import {DesiredCapabilities, ServerConfig, Browser, ClientHelper}   from "../../..";
import {standardCapabilities, standardServerConfig}                 from "../../0_helper/config";
import _                                                            from "lodash";

describe(`Using the BrowserWdjs class`, (): void => {

    const conf: ServerConfig = _.cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = _.cloneDeep(standardCapabilities);

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    describe(`and work with the title`, (): void => {
        let browser: Browser;

        beforeAll((): void => {
            browser = ClientHelper.create(conf, capabilities);
        });

        beforeEach((): Promise<void> => {
            return browser.get(`/`);
        });

        it(`the getTitle method should get the correct title 
        - (test case id: 69c764e0-ad69-4bdf-b2a1-fd259ea57d04)`, async (): Promise<void> => {
            expect(await browser.getTitle()).toEqual(`React App`);
        });
    });

    afterAll(async (): Promise<void[]> => {
        return ClientHelper.cleanup();
    })
});