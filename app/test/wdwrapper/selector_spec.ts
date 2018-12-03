import {Browser}        from "../../driver/interface/Browser";
import {Config}         from "../../driver/interface/Config";
import {BrowserFactory} from "../../driver/lib/BrowserFactory";
import {By}             from "../../driver/lib/Locator";

const conf: Config = {
    browserName: "chrome",
    serverUrl: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost:3000"
};

describe('Locating an element', () => {
    let browser: Browser;

    beforeAll(async () => {
        browser = await BrowserFactory.create(conf, "wdjs");
    }, 10000);

    describe('by cssContainingText', () => {
        it('and klicking on a drop down should change the value of the drop down', async () => {
            const dropDown = browser.element(By.css("#exampleSelect"));
            const fourthElement = dropDown.element(By.cssContainingText("option", "4"));

            // await dropDown.click();
            await browser.get("/");

            await fourthElement.click();

            expect(await dropDown.getAttribute("value")).toBe("4");
        }, 10000);
    });

    describe('by xpath', () => {
        it('should find the text on an button', async () => {
            const button = browser.element(By.xpath("//button[contains(text(),'Danger!')]"));
            await browser.get("/");
            expect(await button.getText()).toBe("Danger!")
        },10000);
    });

    describe('by css', () => {
        it('should find the text on an button', async () => {
            const button = browser.element(By.css(".btn-danger"));
            await browser.get("/");
            expect(await button.getText()).toBe("Danger!")
        },10000);
    });

    afterAll(async () => {
        await BrowserFactory.cleanup();
    })
});