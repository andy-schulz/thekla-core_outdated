import {DesiredCapabilities}                        from "../../../config/DesiredCapabilities";
import {ServerConfig}                               from "../../../config/ServerConfig";
import {Browser}                                    from "../../../driver/interface/Browser";
import {ClientHelper}                               from "../../../driver/lib/client/ClientHelper";
import {standardCapabilities, standardServerConfig} from "../../0_helper/config";
import _                                            from "lodash";

describe(`Using the BrowserWdjs class`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const conf: ServerConfig = _.cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = _.cloneDeep(standardCapabilities);

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