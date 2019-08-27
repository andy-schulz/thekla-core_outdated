import {
    Browser, WebElementFinder, By, UntilElement, ServerConfig, DesiredCapabilities, ClientHelper
}                  from "../..";
import {configure} from "log4js";
import {ProxyType} from "../../config/DesiredCapabilities";
import {LogLevel}  from "../../config/ServerConfig";

configure(`res/config/log4js.json`);

describe(`Waiting for WD Elements`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

    const conf: ServerConfig = {
        automationFramework: {
            type: process.env.FRAMEWORK === `wdio` ? `wdio` : `wdjs`,
            logLevel:  (process.env.LOGLEVEL ? process.env.LOGLEVEL : `info`) as LogLevel
        },
        serverAddress: {
            hostname: process.env.SERVER_HOSTNAME ? process.env.SERVER_HOSTNAME : `localhost`
        },
        baseUrl: process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`,
    };

    const capabilities: DesiredCapabilities = {
        browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
        proxy: process.env.PROXY_TYPE === `manual` ? {
            proxyType: `manual`,
            httpProxy: process.env.PROXY_SERVER,
            sslProxy: process.env.PROXY_SERVER,
        } : {
            proxyType: `system`
        }
    };


    let browser: Browser;
    let appearButton4000ShallWait: WebElementFinder;


    afterAll((): Promise<void[]> => {
        return ClientHelper.cleanup();
    });

    beforeAll((): void => {
        browser = ClientHelper.create(conf, capabilities);
    },20000);

    describe(`and try to implicitly wait for an Element`,(): void => {

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
        }, 20000);

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