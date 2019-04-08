import {DesiredCapabilities, SeleniumConfig} from "../../config/SeleniumConfig";
import {Browser}                             from "../../driver/interface/Browser";
import {BrowserWdjs}                         from "../../driver/wdjs/BrowserWdjs";

const selConfig: SeleniumConfig = {
    seleniumServerAddress: "http://localhost:4444/wd/hub",
};

const desiredCapabilities: DesiredCapabilities =  {
    browserName: "chrome"
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('Using the browser object', () => {

    afterAll(async () => {
        return await BrowserWdjs.cleanup();
    });
    describe('to retrieve the title', () => {
        it('should equal the site title ' +
            '- (test case id: 5411140d-4b1a-408b-ab9a-995ab200825d)', async () => {
            const title = "React App";

            const browser: Browser = await BrowserWdjs.create(selConfig, desiredCapabilities);

            await browser.get("http://localhost:3000/delayed");
            expect(await browser.getTitle()).toBe(title);
        });
    });

    describe('to retrieve the url', () => {
        it('should equal the sites url ' +
            '- (test case id: 6fef0368-82c6-4d08-9bfa-a9c399c0446d)', async () => {
            const url = "http://localhost:3000/delayed";

            const browser: Browser = await BrowserWdjs.create(selConfig, desiredCapabilities);

            await browser.get("http://localhost:3000/delayed");
            expect(await browser.getCurrentUrl()).toBe(url);
        });
    });
});