import {Browser}          from "../../driver/interface/Browser";
import {BrowserWdjs}      from "../../driver/wdjs/BrowserWdjs";
import {CapabilitiesWdjs} from "../../driver/wdjs/interfaces/CapabilitiesWdjs";
import {BrowserFactory}   from "../../driver/lib/BrowserFactory";
import {By}               from "../../driver/lib/Locator";

const conf: CapabilitiesWdjs = {
    browserName: "chrome",
    serverUrl: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost:3000"
};

describe('Locating an element', () => {
    let browser: Browser;

    beforeAll(async () => {
        browser = await BrowserWdjs.create(conf);
    }, 10000);

    describe('by cssContainingText', () => {
        it('and klicking on a drop down should change the value of the drop down - (test case id: f5f57f3e-9cf5-45c2-a990-5014a1854844)', async () => {
            const dropDown = browser.element(By.css("#exampleSelect"));
            const fourthElement = dropDown.element(By.cssContainingText("option", "4"));

            // await dropDown.click();
            await browser.get("/");

            await fourthElement.click();

            expect(await dropDown.getAttribute("value")).toBe("4");
        }, 10000);
    });

    describe('by xpath', () => {
        it('should find the text on an button - (test case id: d5306178-a01d-4883-b9cd-5a52d838c02b)', async () => {
            const button = browser.element(By.xpath("//button[contains(text(),'Danger!')]"));
            await browser.get("/");
            expect(await button.getText()).toBe("Danger!")
        },10000);
    });

    describe('by css', () => {
        it('should find the text on an button - (test case id: d21d0eb9-f64d-431e-95a6-c7b11519ba50)', async () => {
            const button = browser.element(By.css(".btn-danger"));
            await browser.get("/");
            expect(await button.getText()).toBe("Danger!")
        },10000);
    });

    afterAll(async () => {
        return BrowserFactory.cleanup();
    })
});