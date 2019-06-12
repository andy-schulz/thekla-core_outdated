import {BrowserWdjs}                                                        from "../../driver/wdjs/BrowserWdjs";
import {Browser, DesiredCapabilities, WebElementFinder, SeleniumConfig, By} from "../..";

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

describe(`When annotating`, (): void => {

    describe(`an element`, (): void => {
        const confAnnotate: SeleniumConfig = conf;
        confAnnotate.annotateElement = true;
        let browser: Browser;

        let passwordField: WebElementFinder;
        let emailField: WebElementFinder;

        beforeAll((): void => {
            browser = BrowserWdjs.create(confAnnotate, capabilities);

            passwordField = browser.element(By.css(`#examplePassword`));
            emailField = browser.element(By.css(`#exampleEmail`));
        });

        it(`it should change the style on that element`
            + `- (test case id: 36120355-5bc5-4c31-a4a0-7b58d85b7438)`, async (): Promise<void> => {

            await browser.get(`/`);

            await passwordField.sendKeys(`mypassword`);

            const getStyle = function (): string | null {
                const element: HTMLElement | null = document.getElementById(`examplePassword`);
                if(!element)
                    return `none found`;
                else
                    return element.getAttribute(`style`);
            };

            const styleAfterHighlight = await browser.executeScript(getStyle);

            expect(styleAfterHighlight.toString().toLowerCase()).toBe(`color: red; border: 2px solid red;`);
        }, 10000);

        it(`it should reset the style after execution to null`
            + `- (test case id: 5d482ee1-6f75-4539-953c-a877ded16842)`, async (): Promise<void> => {

            await browser.get(`/`);

            const getStyle = function (): string | null {
                const element: HTMLElement | null = document.getElementById(`examplePassword`);
                if(!element)
                    return `none found`;
                else
                    return element.getAttribute(`style`);
            };

            const styleBeforeHighlight = await browser.executeScript(getStyle);
            expect(styleBeforeHighlight).toBeNull();


            await passwordField.sendKeys(`mypassword`);
            await emailField.sendKeys(`myEmail`);

            const styleAfterHighlight = await browser.executeScript(getStyle);

            expect(styleAfterHighlight).toBe(`null`);
        }, 30000);

        it(`it should reset the style after execution`
            + `- (test case id: d5dbc71d-1a17-44ba-9e76-3e2be5c6d465)`, async (): Promise<void> => {

            await browser.get(`/`);

            const getStyle = function (): string | null {
                const element: HTMLElement | null = document.getElementById(`examplePassword`);
                if(!element)
                    return `none found`;
                else
                    return element.getAttribute(`style`);
            };

            const setStyle = function(): void {
                const element: HTMLElement | null = document.getElementById(`examplePassword`);
                if(element)
                    element.setAttribute(`style`, `color:blue;`);
            };

            await browser.executeScript(setStyle);

            const styleBeforeHighlight = await browser.executeScript(getStyle);

            expect(styleBeforeHighlight).toEqual(`color:blue;`);

            await passwordField.sendKeys(`mypassword`);
            await emailField.sendKeys(`myEmail`);

            const styleAfterHighlight = await browser.executeScript(getStyle);

            expect(styleAfterHighlight).toBe(`color:blue;`);
        }, 30000);

    });

    describe(`the test with a message`, (): void => {
        const confAnnotate: SeleniumConfig = conf;
        confAnnotate.displayTestMessages = true;
        let browser: Browser;

        beforeAll((): void => {
            browser = BrowserWdjs.create(confAnnotate, capabilities);
        });

        it(`a test message should be displayed`
            + `- (test case id: 2fe31617-3257-401b-b380-9543665f09f5)`, async (): Promise<void> => {
            const doesNotExist = browser.element(By.css(`#doesNotExist`));

            await browser.get(`/`);

            const getInnerHtml = function(): string {
                return document.getElementsByClassName(`alert`)[0].innerHTML
            };

            try {
                await doesNotExist.click();
                expect(false).toBeTruthy(`Should throw an error but it doesnt`)
            }catch (e) {
                // eslint-disable-next-line
                const element = await browser.executeScript(getInnerHtml);
                expect(element).toBe(`Trying to find 'Element' selected by: &gt;&gt;byCss: #doesNotExist&lt;&lt;`)
            }
        }, 30000);
    });

    afterAll(async (): Promise<void[]> => {
        return BrowserWdjs.cleanup();
    })
});