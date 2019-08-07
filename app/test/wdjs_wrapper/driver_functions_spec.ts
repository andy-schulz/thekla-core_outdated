import {Browser, DesiredCapabilities, ServerConfig} from "../..";
import {BrowserWdjs}                                from "../../driver/wdjs/BrowserWdjs";
import {clientRect}                                 from "../0_helper/browser_viewport";

const selConfig: ServerConfig = {
    serverAddress: {
        hostname: `localhost`
    },
};

const desiredCapabilities: DesiredCapabilities =  {
    browserName: `chrome`
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

interface Rect { bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
}

describe(`Using the browser object`, (): void => {

    afterAll(async (): Promise<void[]> => {
        return BrowserWdjs.cleanup();
    });

    describe(`to retrieve the title`, (): void => {
        it(`should equal the site title ` +
            `- (test case id: 5411140d-4b1a-408b-ab9a-995ab200825d)`, async (): Promise<void> => {
            const title = `React App`;

            const browser: Browser = BrowserWdjs.create(selConfig, desiredCapabilities);

            await browser.get(`http://framework-tester.test-steps.de/delayed`);
            expect(await browser.getTitle()).toBe(title);
        });
    });

    describe(`to retrieve the url`, (): void => {
        it(`should equal the sites url ` +
            `- (test case id: 6fef0368-82c6-4d08-9bfa-a9c399c0446d)`, async (): Promise<void> => {
            const url = `http://framework-tester.test-steps.de/delayed`;

            const browser: Browser = BrowserWdjs.create(selConfig, desiredCapabilities);

            await browser.get(`http://framework-tester.test-steps.de/delayed`);
            expect(await browser.getCurrentUrl()).toBe(url);
        });
    });

    describe(`to scroll the page`, (): void => {
        it(`should succeed when page is scrolled down` +
            `- (test case id: 6fef0368-82c6-4d08-9bfa-a9c399c0446d)`, async (): Promise<void> => {
            const browser: Browser = BrowserWdjs.create(selConfig, desiredCapabilities);
            await browser.get(`http://framework-tester.test-steps.de/tables`);



            const rectStart: Rect[] = (await browser.executeScript(clientRect)) as Rect[];
            expect(rectStart[0].top).toBe(0);
            expect(rectStart[0].bottom).toBeGreaterThanOrEqual(7000);

            await browser.scrollTo({x:0,y:-1});

            const rectEnd: Rect[] = await browser.executeScript(clientRect) as Rect[];
            expect(rectEnd[0].top).toBeLessThanOrEqual(6000);
            expect(rectEnd[0].bottom).toBeLessThanOrEqual(1000);

            await browser.scrollTo({x:0,y:0});

            const rectStart2: Rect[] = (await browser.executeScript(clientRect)) as Rect[];
            expect(rectStart2[0].top).toBe(0);
            expect(rectStart2[0].bottom).toBeGreaterThanOrEqual(7000);
        });
    });
});