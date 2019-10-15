import {ClientWdio}                                                             from "../../../driver/wdio/ClientWdio";
import {Browser, DesiredCapabilities, WebElementFinder, ServerConfig, By}       from "../../..";
import {setBrowserStackSessionName, standardCapabilities, standardServerConfig} from "../../0_helper/config";
import {cloneDeep}                                                              from "lodash";

describe(`The annotation`, (): void => {

    let browser: Browser;

    const conf: ServerConfig = cloneDeep(standardServerConfig);
    conf.annotateElement = true;
    const capabilities: DesiredCapabilities = cloneDeep(standardCapabilities);
    setBrowserStackSessionName(capabilities, `annotator_spec.ts`);

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        browser = ClientWdio.create({serverConfig: conf, capabilities: capabilities});

    });

    afterAll(async (): Promise<void[]> => {
        return ClientWdio.cleanup();
    });

    describe(`without an annotation parameter`, (): void => {
        let emailField: WebElementFinder;

        beforeAll((): void => {
            emailField = browser.element(By.css(`body`)).element(By.css(`#exampleEmail`));
        });

        it(`should not be performed on the element 
        - (test case id: 9f5d9b10-f864-45ed-8d85-8ce1c661300f)`, async (): Promise<void> => {
            await browser.get(`/`);
            await emailField.sendKeys(`myEmail`);
        });
    });

    describe(`of element`, (): void => {
        let passwordField: WebElementFinder;
        let emailField: WebElementFinder;

        beforeAll((): void => {

            passwordField = browser.element(By.css(`#examplePassword`));
            emailField = browser.element(By.css(`#exampleEmail`));
        });

        it(`should change the style on that element 
        - (test case id: 36120355-5bc5-4c31-a4a0-7b58d85b7438)`, async (): Promise<void> => {

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
            expect(styleAfterHighlight).not.toBeNull(`styleAfterHighlight should not be null`);
            expect(styleAfterHighlight.toString().toLowerCase()).toContain(`/* annotation start */ color: red; border: 2px solid red; /* annotation end */`);
        });

        it(`it should reset the style after execution to null 
        - (test case id: 5d482ee1-6f75-4539-953c-a877ded16842)`, async (): Promise<void> => {

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

            expect(styleAfterHighlight).toEqual(`null`, `style should be null after reset`);
        });

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
        });

    });
});

describe(`The test search message`, function () {

    let browser: Browser;
    const conf: ServerConfig = cloneDeep(standardServerConfig);
    conf.displayTestMessages = true;

    const capabilities: DesiredCapabilities = cloneDeep(standardCapabilities);
    setBrowserStackSessionName(capabilities, `annotator_spec.ts`);

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        browser = ClientWdio.create({serverConfig: conf, capabilities: capabilities});
    });

    afterAll(async (): Promise<void[]> => {
        return ClientWdio.cleanup();
    });

    describe(`the test with a message`, (): void => {

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
        });
    });
});