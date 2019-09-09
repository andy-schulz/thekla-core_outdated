import {DesiredCapabilities}                        from "../../config/DesiredCapabilities";
import {ServerConfig}                               from "../../config/ServerConfig";
import {Browser}                                    from "../../driver/interface/Browser";
import {ClientHelper}                               from "../../driver/lib/client/ClientHelper";
import {until}                                      from "../../driver/lib/Condition";
import {By}                                         from "../../driver/lib/element/Locator";
import {standardCapabilities, standardServerConfig} from "../0_helper/config";
import _                                            from "lodash";
import { WebElementFinder } from "../..";

describe(`drag an element`, (): void => {

    const conf: ServerConfig = _.cloneDeep(standardServerConfig);
    const caps: DesiredCapabilities = _.cloneDeep(standardCapabilities);

    let browser: Browser;
    let dragElement0: WebElementFinder,
        dragElement1: WebElementFinder,
        dragElement2: WebElementFinder,
        dragElement3: WebElementFinder,
        dragElement4: WebElementFinder,
        dragElement5: WebElementFinder,
        dragIndicator: WebElementFinder,
        infoMessage: WebElementFinder;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        browser = ClientHelper.create(conf, caps);
        dragElement0 = browser.element(By.css(`[data-test-id='item-0']`));
        dragElement1 = browser.element(By.css(`[data-test-id='item-1']`));
        dragElement2 = browser.element(By.css(`[data-test-id='item-2']`));
        dragElement3 = browser.element(By.css(`[data-test-id='item-3']`));
        dragElement4 = browser.element(By.css(`[data-test-id='item-4']`));
        dragElement5 = browser.element(By.css(`[data-test-id='item-5']`));

        dragIndicator = browser.element(By.xpath(`//*[text()='Something was dragged!']`));
        infoMessage = browser.element((By.css(`[data-text-id='EventDetails']`)));
    })

    afterAll((): Promise<void[]> => {
        return ClientHelper.cleanup()
    });

    describe(`to another element`, (): void => {

        // it(`should reorder the element list
        // - (test case id: e0c3ded6-cb21-4e58-8076-33660548e6ac)`, async (): Promise<void> => {
        //
        //     const browser = ClientHelper.create(conf, caps);
        //
        //     await browser.get(`https://jqueryui.com/resources/demos/droppable/default.html`);
        //
        //     const element0 = browser.element(By.css(`div#draggable`))
        //         .shallWait(UntilElement.is.visible());
        //     const element1 = browser.element(By.css(`div#droppable`))
        //         .shallWait(UntilElement.is.visible());
        //
        //     const rectElem0 = await element0.getCenterPoint();
        //     const rectElem1 = await element1.getCenterPoint();
        //
        //     console.log(rectElem0);
        //     console.log(rectElem1);
        //
        //     await element0.dragToElement(element1);
        //
        //     await Utils.wait(10000);
        // });

        it(`should reorder the element list from bottom to top 
        - (test case id: e0c3ded6-cb21-4e58-8076-33660548e6ac)`, async (): Promise<void> => {

            await browser.get(`/dragndrop`);
            await dragElement5.dragToElement(dragElement2);
            await browser.wait(until((): Promise<boolean> => dragIndicator.isVisible()));
            const message = await infoMessage.getText();
            expect(message).toEqual(`Element item-5 was moved from position 5 to position 2`)
        });

        it(`should reorder the element list from top to bottom
        - (test case id: e0c3ded6-cb21-4e58-8076-33660548e6ac)`, async (): Promise<void> => {

            await browser.get(`/dragndrop`);
            await dragElement0.dragToElement(dragElement2);
            await browser.wait(until((): Promise<boolean> => dragIndicator.isVisible()));
            const message = await infoMessage.getText();
            expect(message).toEqual(`Element item-0 was moved from position 0 to position 2`)
        });
    });
});