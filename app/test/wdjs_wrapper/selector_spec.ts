import {Browser, By, DesiredCapabilities, RunningBrowser, ServerConfig} from "../..";
import {BrowserWdjs}                                                    from "../../driver/wdjs/BrowserWdjs";

const conf: ServerConfig = {
    serverAddress: {
        hostname: `localhost`
    },
    baseUrl: `http://framework-tester.test-steps.de`,
};

const capabilities: DesiredCapabilities = {
    browserName: `firefox`,
    proxy: {
        type: `system`
    }
};

describe(`Locating a waiter`, (): void => {
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
        }, 20000);
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
        },20000);
    });

    describe(`by chained xpath`,  (): void => {
        it(`should locate the email1 label 
        - (test case id: 063d50fe-421b-4354-b63e-60ac495f8360)`, async (): Promise<void> => {
            const container = browser.element(By.xpath(`//*[contains(@data-test-id,'LoginExampleRow1')]`));
            const label = container.element(By.xpath(`//label`));

            await browser.get(`/`);
            expect(await label.getText()).toBe(`Email1`)
        });

        it(`should locate the email2 label 
        - (test case id: 063d50fe-421b-4354-b63e-60ac495f8360)`, async (): Promise<void> => {
            const container = browser.element(By.xpath(`//*[contains(@data-test-id,'LoginExampleRow2')]`));
            const label = container.element(By.xpath(`.//label[contains(@for,'exampleEmail')]`));

            await browser.get(`/`);
            expect(await label.getText()).toBe(`Email2`)
        },1000000);
    });

    describe(`by chained xpath and css`, () => {
        it(`should locate the email1 label 
        - (test case id: 063d50fe-421b-4354-b63e-60ac495f8360)`, async (): Promise<void> => {
            const container = browser.element(By.xpath(`//*[contains(@data-test-id,'LoginExampleRow1')]`));
            const label = container.element(By.css(`label[for='exampleEmail']`));

            await browser.get(`/`);
            expect(await label.getText()).toBe(`Email1`)
        });

        it(`should locate the email2 label 
        - (test case id: 063d50fe-421b-4354-b63e-60ac495f8360)`, async (): Promise<void> => {
            const container = browser.element(By.xpath(`//*[contains(@data-test-id,'LoginExampleRow2')]`));
            const label = container.element(By.css(`label[for='exampleEmail']`));

            await browser.get(`/`);
            expect(await label.getText()).toBe(`Email2`)
        });
    });

    describe(`by chained css and xpath`, () => {
        it(`should locate the email1 label 
        - (test case id: 063d50fe-421b-4354-b63e-60ac495f8360)`, async (): Promise<void> => {
            const container = browser.element(By.css(`[data-test-id='LoginExampleRow1']`));
            const label = container.element(By.xpath(`//label`));

            await browser.get(`/`);
            expect(await label.getText()).toBe(`Email1`)
        });

        it(`should locate the email2 label 
        - (test case id: 063d50fe-421b-4354-b63e-60ac495f8360)`, async (): Promise<void> => {
            const container = browser.element(By.css(`[data-test-id='LoginExampleRow2']`));
            const label = container.element(By.xpath(`.//label`));

            await browser.get(`/`);
            expect(await label.getText()).toBe(`Email2`)
        });
    });

    afterAll(async (): Promise<void[][]> => {
        return RunningBrowser.cleanup();
    })
});