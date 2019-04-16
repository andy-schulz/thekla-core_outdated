import {
    Browser, WebElementFinder, By, UntilElement, SeleniumConfig, DesiredCapabilities
} from "../..";
import {configure}   from "log4js";
import {BrowserWdjs} from "../../driver/wdjs/BrowserWdjs";

configure("res/config/log4js.json");

const conf: SeleniumConfig = {
    seleniumServerAddress: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost:3000",
};

const capabilities: DesiredCapabilities = {
    browserName: "chrome",
    proxy: {
        type: "direct"
    }
};


describe('Waiting for WD Elements', () => {

    afterAll(() => {
        return BrowserWdjs.cleanup();
    });

    describe('and try to implicitly wait for an Element', async () => {
        let browser: Browser;
        let appearButton5000ShallWait: WebElementFinder;

        beforeAll(async () => {
            browser = BrowserWdjs.create(conf, capabilities);
        },20000);

        it('the system should wait for a second - (test case id: d106ba43-542c-44c7-959e-f64dcdc6943d)', async () => {
            appearButton5000ShallWait = browser.element(By.css("[data-test-id='AppearButtonBy5000']"))
                .shallWait(UntilElement.is.visible().forAsLongAs(1000));

            await browser.get("/delayed");
            expect(await appearButton5000ShallWait.isVisible()).toEqual(false)
        }, 20000);

        it('the system should wait for a second - (test case id: 2af14d42-6f9d-4532-a151-c4d4390c352e)', async () => {
            appearButton5000ShallWait = browser.element(By.css("[data-test-id='AppearButtonBy5000']"))
                .shallWait(UntilElement.is.visible().forAsLongAs(5000));

            await browser.get("/delayed");
            expect(await appearButton5000ShallWait.isVisible()).toEqual(true)
        }, 20000);

        it('the system should wait for element after redirect - (test case id: a86b8f45-9706-40ab-bdd2-a5319cde0d0f)', async () => {
            appearButton5000ShallWait = browser.element(By.css("[data-test-id='AppearButtonBy5000']"))
                .shallWait(UntilElement.is.visible().forAsLongAs(11000));

            await browser.get("/redirect");
            expect(await appearButton5000ShallWait.isVisible()).toEqual(true)
        }, 20000);
    });
});