import "jasmine"
import {Config} from "../interface/Config";
import {BrowserWdjs} from "../src/wdjs/BrowserWdjs";
import {Browser} from "../interface/Browser";

describe('test', () => {
    it('should   - (test case id: )', async () => {
        const conf: Config = {
            browserName: "firefox",
            serverUrl: "http://localhost:4444/wd/hub",
            // chromeOptions: {
            //     binary: "C:\\PProgramme\\GoogleChromePortable64\\App\\Chrome-bin\\chrome.exe"
            // }
        };

        const browser: Browser = await BrowserWdjs.create(conf);
        await browser.get("http://www.google.de");
        await BrowserWdjs.cleanup();
        // await browser.quit();
    },10000);
});