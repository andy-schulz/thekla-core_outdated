import {stringify}      from "querystring";
import {Browser}        from "../driver/interface/Browser";
import {Config}         from "../driver/interface/Config";
import {BrowserFactory} from "../driver/lib/BrowserFactory";
import {Utils}          from "../driver/utils/Utils";
import {BrowserWdjs}    from "../driver/wdjs/BrowserWdjs";
import {By}             from "../driver/lib/Locator";

const conf: Config = {
    browserName: "chrome",
    serverUrl: "http://localhost:4444/wd/hub",
};

describe('trying to access the Frame', () => {
    let browser: Browser;

    beforeAll(() => {
        browser = BrowserFactory.create(conf);
    });

    it('by css the frame should be found.', async () => {
        const frame = browser.frame(By.css(".button-in-single-frame"));
        const button = frame.element(By.css(".btn-secondary"));

        browser.get("http://localhost:3000/frame2");
        // await Utils.wait(5000);
        expect(await button.getText()).toEqual("Button In Frame")
    }, 20000);

    fit('by css the frame in frame should be found.', async () => {
        const frame1 = browser.frame(By.css(".button-in-two-frames"));
        const frame2 = browser.frame(By.css(".button-in-single-frame"));
        const button = frame2.element(By.css(".btn-secondary"));

        browser.get("http://localhost:3000/frame2");
        expect(await button.getText()).toEqual("Button inside single frame");

    }, 20000);

    fit('by css the frame in frame should be found.', async () => {
        const frame1 = browser.frame(By.css(".button-in-two-frames"));
        const frame2 = browser.frame(By.css(".button-in-single-frame"));
        const button = frame2.element(By.css(".btn-secondary"));

        browser.get("http://localhost:3000/frame2");
        expect(await button.getText()).toEqual("Button nested inside frame of frame");

    }, 20000);
});