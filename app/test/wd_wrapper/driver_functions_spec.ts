import {Browser, DesiredCapabilities, SeleniumConfig} from "../..";
import {BrowserWdjs}                                  from "../../driver/wdjs/BrowserWdjs";

const selConfig: SeleniumConfig = {
    seleniumServerAddress: `http://localhost:4444/wd/hub`,
};

const desiredCapabilities: DesiredCapabilities =  {
    browserName: `chrome`
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe(`Using the browser object`, (): void => {

    afterAll(async (): Promise<void[]> => {
        return BrowserWdjs.cleanup();
    });

    describe(`to retrieve the title`, (): void => {
        it(`should equal the site title ` +
            `- (test case id: 5411140d-4b1a-408b-ab9a-995ab200825d)`, async (): Promise<void> => {
            const title = `React App`;

            const browser: Browser = BrowserWdjs.create(selConfig, desiredCapabilities);

            await browser.get(`https://teststepsframeworktester.azurewebsites.net/delayed`);
            expect(await browser.getTitle()).toBe(title);
        });
    });

    describe(`to retrieve the url`, (): void => {
        it(`should equal the sites url ` +
            `- (test case id: 6fef0368-82c6-4d08-9bfa-a9c399c0446d)`, async (): Promise<void> => {
            const url = `https://teststepsframeworktester.azurewebsites.net/delayed`;

            const browser: Browser = BrowserWdjs.create(selConfig, desiredCapabilities);

            await browser.get(`https://teststepsframeworktester.azurewebsites.net/delayed`);
            expect(await browser.getCurrentUrl()).toBe(url);
        });
    });
});