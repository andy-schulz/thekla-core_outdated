import {Browser, ClientHelper, DesiredCapabilities, ServerConfig} from "../../..";
import {standardCapabilities, standardServerConfig}               from "../../0_helper/config";
import _                                                          from "lodash";

/**
 * check browser_creation_spec in lib_test for more test combinations
 */

describe(`When using the ClientWdio class`, (): void => {

    const conf: ServerConfig = _.cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = _.cloneDeep(standardCapabilities);

    const testUrl = process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`;

    beforeAll(async (): Promise<void> => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        await ClientHelper.cleanup();
    });

    afterEach(async (): Promise<void> => {
        await ClientHelper.cleanup();
    });

    describe(`to start a single browser`, (): void => {
        it(`with a name and an browser instance, it should set this name ` +
            `- (test case id: f2e8b6f5-d639-445c-95a6-ce2ebd82a1ed)`, async (): Promise<void> => {
            const browser: Browser = ClientHelper.create(conf, capabilities, `theNewBrowserName`);
            await browser.get(testUrl);

            expect(ClientHelper.availableSessions.length).toBe(1, `length check for # of browser in ClientWdio failed`);
            expect(ClientHelper.availableSessions[0]).toBe(`theNewBrowserName`);
            expect(ClientHelper.getClient(`theNewBrowserName`)).toEqual(browser);

        });
    });
});