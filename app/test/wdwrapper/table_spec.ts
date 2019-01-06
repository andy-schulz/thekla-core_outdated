import {
    Browser, BrowserFactory, Config, By
} from "../..";

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
        return BrowserFactory.cleanup()
    });

    it('select elements by - (test case id: 48788a13-ade7-4b76-b366-8eae26a1194d)', async () => {
        const list = browser.all(By.css("table tr")).filteredByText("James");

        await browser.get("http://localhost:3000/tables");
        const tableText: string[] = await list.getText();
        expect(await list.count()).toBe(2);
        expect(tableText.length).toBe(2);
        expect(tableText.toString()).toContain("James");
    }, 40000);
});