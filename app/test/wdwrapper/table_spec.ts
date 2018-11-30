import {Browser}        from "../../driver/interface/Browser";
import {Config}         from "../../driver/interface/Config";
import {BrowserFactory} from "../../driver/lib/BrowserFactory";
import {Key}            from "../../driver/lib/Key";
import {By}             from "../../driver/lib/Locator";

const conf: Config = {
    browserName: "chrome",
    serverUrl: "http://localhost:4444/wd/hub",
    // firefoxOptions: {
    // binary: "C:\\PProgramme\\FirefoxPortable64\\App\\Firefox\\firefox.exe",
    // binary: "C:\\PProgramme\\FirefoxPortable\\App\\Firefox\\firefox.exe",
    // proxy: {
    //     proxyType: "direct"
    // }
    // }
    // chromeOptions: {
    //     binary: "C:\\PProgramme\\GoogleChromePortable64\\App\\Chrome-bin\\chrome.exe"
    // }
};

describe('a simple table', () => {
    let browser: Browser;

    beforeAll(async (done) => {
        browser = await BrowserFactory.create(conf, "wdjs");
        done();
    });

    afterAll(async () => {
        await BrowserFactory.cleanup()
    });

    it('select elements by', async () => {
        const list = browser.all(By.css("table tr")).filteredByText("James");

        await browser.get("http://localhost:3000");
        const tableText = await list.getText();
    }, 40000);
});