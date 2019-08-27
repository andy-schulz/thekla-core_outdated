import {DesiredCapabilities}                        from "../../config/DesiredCapabilities";
import {ServerConfig}                               from "../../config/ServerConfig";
import {ClientCtrls}                                from "../../driver/interface/ClientCtrls";
import {ClientHelper}                               from "../../driver/lib/client/ClientHelper";
import {By}                                         from "../../driver/lib/element/Locator";
import {Utils}                                      from "../../driver/utils/Utils";
import {Actor}                                      from "../../screenplay/Actor";
import {Sleep}                                      from "../../screenplay/lib/actions/Sleep";
import {BrowseTheWeb}                               from "../../screenplay/web/abilities/BrowseTheWeb";
import {Click}                                      from "../../screenplay/web/actions/Click";
import {element}                                    from "../../screenplay/web/SppWebElements";
import {standardCapabilities, standardServerConfig} from "../0_helper/config";
import { Client }                                   from "webdriver";

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
            // await browser.get(`/`);

            const element0 = browser.element(By.css(`[data-test-id='item-0']`));
            const element1 = browser.element(By.css(`[data-test-id='item-2']`));

            const elementUser = browser.element(By.css(`[data-test-id='usericon']`));
            const dropDown = browser.element(By.css(`button.btn-secondary`));

            await element0.dragToElement(element1);

            // await element0.hover();
            // await Utils.wait(2000);
            // const vl: ClientCtrls<Client> =  browser as unknown as ClientCtrls<Client>;
            // await vl.pointerButtonDown(0)(Promise.resolve());
            // await vl.pointerButtonUp(0)(Promise.resolve());
            // await vl.releaseActions(Promise.resolve());

            await Utils.wait(10000);
        });
    });
});