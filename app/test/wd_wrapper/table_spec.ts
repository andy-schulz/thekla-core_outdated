import {
    Browser, By, SeleniumConfig, DesiredCapabilities
} from "../..";
import {BrowserWdjs} from "../../driver/wdjs/BrowserWdjs";

const conf: SeleniumConfig = {
    seleniumServerAddress: `http://localhost:4444/wd/hub`,
};

const capabilities: DesiredCapabilities = {
    browserName: `chrome`,
    proxy: {
        type: `direct`
    }

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

describe(`a simple table`, (): void => {
    let browser: Browser;

    beforeAll((): void => {
        browser = BrowserWdjs.create(conf, capabilities);
    });

    afterAll(async (): Promise<void[]> => {
        return await BrowserWdjs.cleanup()
    });

    it(`select elements by 
    - (test case id: 48788a13-ade7-4b76-b366-8eae26a1194d)`, async (): Promise<void> => {
        const list = browser.all(By.css(`table tr`)).filteredByText(`James`);

        await browser.get(`https://teststepsframeworktester.azurewebsites.net/tables`);
        const tableText: string[] = await list.getText();
        expect(await list.count()).toBe(2);
        expect(tableText.length).toBe(2);
        expect(tableText.toString()).toContain(`James`);
    }, 40000);
});