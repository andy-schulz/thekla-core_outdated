import {DesiredCapabilities}                        from "../../config/DesiredCapabilities";
import {ServerConfig}                               from "../../config/ServerConfig";
import {ClientHelper}                               from "../../driver/lib/client/ClientHelper";
import {By}                                         from "../../driver/lib/element/Locator";
import {Utils}                                      from "../../driver/utils/Utils";
import {standardCapabilities, standardServerConfig} from "../0_helper/config";

describe(`drag an element`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    const conf: ServerConfig = standardServerConfig;
    const caps: DesiredCapabilities = standardCapabilities;

    afterAll((): Promise<void[]> => {
        return ClientHelper.cleanup()
    });

    describe(`to another element`, (): void => {

        it(`should reorder the element list 
        - (test case id: e0c3ded6-cb21-4e58-8076-33660548e6ac)`, async (): Promise<void> => {

            const browser = ClientHelper.create(conf, caps);

            await browser.get(`/dragndrop`);

            const element0 = browser.element(By.css(`[data-test-id='item-0']`));
            const element1 = browser.element(By.css(`[data-test-id='item-2']`));

            await element0.dragToElement(element1);

            await Utils.wait(10000);
        });
    });
});