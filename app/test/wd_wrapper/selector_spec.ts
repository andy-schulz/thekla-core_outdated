import {Browser, By, DesiredCapabilities, RunningBrowser, SeleniumConfig} from "../..";
import {BrowserWdjs}                                                      from "../../driver/wdjs/BrowserWdjs";

const conf: SeleniumConfig = {
    seleniumServerAddress: `http://localhost:4444/wd/hub`,
    baseUrl: `https://teststepsframeworktester.azurewebsites.net`,
};

const capabilities: DesiredCapabilities = {
    browserName: `chrome`,
    proxy: {
        type: `direct`
    }
};

describe(`Locating an waiter`, (): void => {
    let browser: Browser;

    beforeAll((): void => {
        browser = BrowserWdjs.create(conf, capabilities);
    }, 10000);

    describe(`by cssContainingText`, (): void => {

        it(`and klicking on a drop down should change the value of the drop down 
        - (test case id: f5f57f3e-9cf5-45c2-a990-5014a1854844)`, async (): Promise<void> => {
            const dropDown = browser.element(By.css(`#exampleSelect`));
            const fourthElement = dropDown.element(By.cssContainingText(`option`, `4`));

            await browser.get(`/`);

            await fourthElement.click();

            expect(await dropDown.getAttribute(`value`)).toBe(`4`);
        }, 10000);
    });

    describe(`by xpath`, (): void => {

        it(`should find the text on an button 
        - (test case id: d5306178-a01d-4883-b9cd-5a52d838c02b)`, async (): Promise<void> => {
            const button = browser.element(By.xpath(`//button[contains(text(),'Danger!')]`));
            await browser.get(`/`);
            expect(await button.getText()).toBe(`Danger!`)
        },10000);
    });

    describe(`by css`, (): void => {

        it(`should find the text on an button 
        - (test case id: d21d0eb9-f64d-431e-95a6-c7b11519ba50)`, async (): Promise<void> => {
            const button = browser.element(By.css(`.btn-danger`));
            await browser.get(`/`);
            expect(await button.getText()).toBe(`Danger!`)
        },10000);
    });

    afterAll(async (): Promise<void[][]> => {
        return RunningBrowser.cleanup();
    })
});