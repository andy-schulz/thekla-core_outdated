import {
    Browser, WebElementFinder, By, UntilElement, ServerConfig, DesiredCapabilities, ClientHelper
}                                                                        from "../..";
import {configure}                                                       from "log4js";
import {standardCapabilities, standardServerConfig, setBrowserStackName} from "../0_helper/config";
import {cloneDeep}                                                       from "lodash";

configure(`res/config/log4js.json`);

describe(`Waiting for WD Elements`, (): void => {

    const conf: ServerConfig = cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = cloneDeep(standardCapabilities);
    setBrowserStackName(capabilities, `wait_for_element_spec.ts`);

    let browser: Browser;
    let appearButton4000ShallWait: WebElementFinder;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
        browser = ClientHelper.create(conf, capabilities);
    });

    afterAll((): Promise<void[]> => {
        return ClientHelper.cleanup();
    });

    describe(`and try to implicitly wait for an Element`, (): void => {

        it(`the system should wait for a second 
        - (test case id: d106ba43-542c-44c7-959e-f64dcdc6943d)`, async (): Promise<void> => {
            appearButton4000ShallWait = browser.element(By.css(`[data-test-id='AppearButtonBy4000']`))
                .shallWait(UntilElement.is.visible().forAsLongAs(1000));

            await browser.get(`/delayed`);
            expect(await appearButton4000ShallWait.isVisible()).toEqual(false)
        });

        it(`the system should wait for 7 seconds 
        - (test case id: 2af14d42-6f9d-4532-a151-c4d4390c352e)`, async (): Promise<void> => {
            appearButton4000ShallWait = browser.element(By.css(`[data-test-id='AppearButtonBy4000']`))
                .shallWait(UntilElement.is.visible().forAsLongAs(7000));

            await browser.get(`/delayed`);
            expect(await appearButton4000ShallWait.isVisible()).toEqual(true)
        });

        it(`the system should wait for element after redirect 
        - (test case id: a86b8f45-9706-40ab-bdd2-a5319cde0d0f)`, async (): Promise<void> => {
            appearButton4000ShallWait = browser.element(By.css(`[data-test-id='AppearButtonBy4000']`))
                .shallWait(UntilElement.is.visible().forAsLongAs(11000));

            await browser.get(`/redirectToDelayed`);
            expect(await appearButton4000ShallWait.isVisible()).toEqual(true)
        });
    });

    describe(`which are chained by xpath`, (): void => {
        it(`should find the element after 5 Seconds 
        - (test case id: 958da8f9-82eb-465c-ace8-bb4496f8f77b)`, async () => {
            const appearRow = browser.element(By.xpath(`//*[@data-test-id='appear']`))
                .shallWait(UntilElement.is.visible().forAsLongAs(11000));

            const appearCol1 = appearRow.element(By.xpath(`.//*[@data-test-id='appearCol1']`));

            const button = appearCol1.element(By.xpath(`.//button`))
                .shallWait(UntilElement.is.visible().forAsLongAs(10000));

            await browser.get(`/delayed`);
            expect(await button.isVisible()).toEqual(true)

        });
    });
});