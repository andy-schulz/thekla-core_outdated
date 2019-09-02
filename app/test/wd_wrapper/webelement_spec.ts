import "jasmine"
import {
    Browser,
    RunningBrowser,
    WebElementFinder,
    By,
    until,
    Utils,
    ServerConfig, DesiredCapabilities
} from "../..";

import {configure}                                  from "log4js";
import {WebElementWdio}                             from "../../driver/wdio/WebElementWdio";
import {BoundaryCheck, boundingRect}                from "../0_helper/browser_viewport";
import {standardCapabilities, standardServerConfig} from "../0_helper/config";
import _                                            from "lodash";

configure(`res/config/log4js.json`);

describe(`When using the Browser object`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const conf: ServerConfig = _.cloneDeep(standardServerConfig);

    const capabilities: DesiredCapabilities = _.cloneDeep(standardCapabilities);

    const testurl = process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`;

    describe(`and calling the get method `, (): void => {
        let browser: Browser;

        beforeAll((): void => {
            browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities)
        });

        it(`with ${testurl}, it should open the URL in the browser.  
        - (test case id: 7767cdde-846e-40c8-9476-adb133516cb0)`, async (): Promise<void> => {
            await browser.get(testurl);
            expect(await browser.getCurrentUrl()).toContain(testurl);
        });
    });

    describe(`and calling the element function`, (): void => {
        let browser: Browser;

        beforeAll((): Promise<void> => {
            browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            return browser.get(testurl);
        });

        afterAll((): Promise<void[]> => {
            return RunningBrowser.cleanup()
        });

        it(`it should return a WebElement object  
        - (test case id: 3dbab3b5-a403-41ea-ad20-465c03c8f9aa)`, (): void => {
            const element: WebElementFinder = browser.element(By.css(`[data-test-id='buttonDropDown']`));
            expect(element.constructor.name).toEqual(WebElementWdio.name, `constructor did not match`);
            expect(element).toEqual(jasmine.any(WebElementWdio), `object type did not match`);
        }, 10000);

        it(`without a description a standard description should be printed 
        - (test case id: a34abdde-c70c-4676-84b6-fff16153b113)`, (): void => {
            const element = browser.element(By.css(`.doesNotExist`));
            const desc = element.toString();
            expect(desc).toContain(`'Element' selected by`);
            expect(desc).toContain(`.doesNotExist`);
        });

        it(`without a description a standard description should be printed 
        - (test case id: aac7ae86-287c-49d8-a76f-55a5911f0892)`, (): void => {
            const element = browser.element(By.css(`.doesNotExist`)).called(`My personal description`);

            const desc = element.toString();
            expect(desc).toContain(`My personal description`);
            expect(desc).toContain(`.doesNotExist`);
        });
    });

    describe(`and try to click on an element`, (): void => {
        let browser: Browser;
        let optionList: WebElementFinder;

        beforeAll((): Promise<void> => {
            browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            optionList = browser.element(By.css(`[data-test-id='buttonDropDown']`));
            return browser.get(testurl);
        });

        afterAll((): Promise<void[]> => {
            return RunningBrowser.cleanup()
        });

        it(`the optionList should be found and opened 
        - (test case id: 879ded3b-ce4b-4475-aacd-310c57774f59)`, async (): Promise<void> => {
            await optionList.click();
            await Utils.wait(1000);
        });

        it(`an error should be thrown when no element is found 
        - (test case id: f1f7e78c-6627-4014-9ed2-10ae559f22b3)`, (): Promise<void> => {
            const optionListNotFound = browser.element(By.css(`[data-test-id='DoesNotExistTestId-f1f7e78c']`));

            return optionListNotFound.click()
                .then((): void => {
                    expect(true).toBe(false, `The click Promise should not be fulfilled`)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }).catch((e: any): void => {
                    expect(e.toString()).toContain(`Did not find the Element:`)
                });

        });

        it(`an error should be thrown when no element is found 
        - (test case id: c689b365-a1f3-4cc7-b2b7-b7c6bf851500)`, async (): Promise<void> => {
            const optionListDelayed = browser.element(By.css(`[data-test-id='buttonDropDown']`));

            await optionListDelayed.click();

        });
    });

    describe(`and try to hover an element`, (): void => {
        let browser: Browser;
        let userName: WebElementFinder,
            hoverElement: WebElementFinder,
            button: WebElementFinder;

        beforeAll((): Promise<void> => {
            browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            hoverElement = browser.element(By.css(`[data-test-id='usericon']`));
            userName = browser.element(By.css(`[data-test-id='hoverusername']`));
            button = browser.element(By.css(`[data-test-id='button']`));
            return browser.get(testurl);
        });

        afterAll((): Promise<void[]> => {
            return RunningBrowser.cleanup()
        });

        it(`the hover element should be displayed 
        - (test case id: 25dbd2a2-b2ae-4ef2-860f-48cca1dac5d6)`, async (): Promise<void> => {
            expect(await userName.isVisible()).toBe(false);
            await hoverElement.hover();
            expect(await userName.isVisible()).toBe(true);
            await button.hover();
            expect(await userName.isVisible()).toBe(false);

            await Utils.wait(5000);
        });
    });

    describe(`to retrieving the element location`, () => {
        let browser: Browser;
        let hoverElement: WebElementFinder;

        beforeAll((): Promise<void> => {
            browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            hoverElement = browser.element(By.css(`[data-test-id='usericon']`));
            return browser.get(`/`);
        });

        afterAll((): Promise<void[]> => {
            return RunningBrowser.cleanup()
        });

        it(`the location object should not be empty
        - (test case id: f2f5e618-d19d-457b-84bb-f31f423a238c)`, async () => {
            const dimension = await hoverElement.getElementLocationInView();
            expect(dimension.boundingRect.top).not.toBeUndefined();
            expect(dimension.boundingRect.bottom).not.toBeUndefined();
            expect(dimension.boundingRect.left).not.toBeUndefined();
            expect(dimension.boundingRect.right).not.toBeUndefined();
            expect(dimension.boundingRect.width).not.toBeUndefined();
            expect(dimension.boundingRect.height).not.toBeUndefined();
            expect(dimension.boundingRect.x).not.toBeUndefined();
            expect(dimension.boundingRect.y).not.toBeUndefined();
            expect(dimension.innerWidth).not.toBeUndefined();
            expect(dimension.innerHeight).not.toBeUndefined();

        });
    });

    describe(`and try to scroll an element into view`, () => {
        let browser: Browser;
        let lastTableRow: WebElementFinder;

        beforeAll((): Promise<void> => {
            browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            lastTableRow = browser.element(By.css(`[data-test-id='lastTableRow']`));

            return browser.get(`/tables`);
        });

        afterAll((): Promise<void[]> => {
            return RunningBrowser.cleanup()
        });

        it(`it should scroll to the element 
        - (test case id: 8284b313-f35f-4841-931f-2927d848d138)`, async () => {
            const className = `lastTableRow`;

            const isOutOnfirstCheck: BoundaryCheck = await browser.executeScript(boundingRect, className) as BoundaryCheck;
            expect(isOutOnfirstCheck.any).toBeTruthy();

            await lastTableRow.scrollIntoView();

            const isOutOnSecondCheck: BoundaryCheck = await browser.executeScript(boundingRect, className) as BoundaryCheck;
            expect(isOutOnSecondCheck.any).toBeFalsy();
        });
    });

    describe(`and try to enter a String to an element`, (): void => {
        let browser: Browser;
        let emailInput: WebElementFinder;

        beforeAll((): Promise<void> => {
            browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            emailInput = browser.element(By.css(`[data-test-id='exampleEmail']`));
            return browser.get(`/`);
        });

        afterEach((): Promise<void> => {
            return browser.get(`/`);
        });

        afterAll((): Promise<void[]> => {
            return RunningBrowser.cleanup()
        });

        it(`the string should be found on the value attribute 
        - (test case id: 5cc595d1-3da0-4418-8a8f-b63b6f909f04)`, async (): Promise<void> => {
            const emailString = `a.b@c.de`;
            await emailInput.sendKeys(emailString);
            expect(await emailInput.getAttribute(`value`)).toEqual(emailString);
        });

        it(`the string should not be found with the getText() Method 
        - (test case id: 5e02cf2a-94c1-487a-a152-05722c67797f)`, async (): Promise<void> => {
            const emailString = `a.b@c.de`;
            await emailInput.sendKeys(emailString);
            expect(await emailInput.getText()).toEqual(``);
            await Utils.wait(2000);
        });
    });

    describe(`and try to wait for an element state`, (): void => {
        let browser: Browser;
        let appearButton10000: WebElementFinder;
        let buttonNeverExists: WebElementFinder;
        let disappearButton10000: WebElementFinder;
        let enabledButton4000: WebElementFinder;

        beforeAll((): void => {
            browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            appearButton10000 = browser.element(By.css(`[data-test-id='AppearButtonBy10000']`));
            buttonNeverExists = browser.element(By.css(`[data-test-id='neverExists']`));
            disappearButton10000 = browser.element(By.css(`[data-test-id='DisappearButtonBy8000']`));
            enabledButton4000 = browser.element(By.css(`[data-test-id='EnabledButtonBy5000']`));
        });

        beforeEach((): Promise<void> => {
            return browser.get(testurl + `/delayed`);
        });

        afterAll((): Promise<void[]> => {
            return RunningBrowser.cleanup()
        });

        it(`the system should wait for 5 Seconds and then timout 
        - (test case id: c004412c-9e79-4df4-8af6-ea079318769d)`, async (): Promise<void> => {
            expect(await appearButton10000.isVisible()).toEqual(false);
            await browser.wait(until((): Promise<boolean> => appearButton10000.isVisible())).catch((e): string => e);
            expect(await appearButton10000.isVisible()).toEqual(false);

        });

        it(`the system should wait for 5 Seconds and then timout 
        - (test case id: c004412c-9e79-4df4-8af6-ea079318769d)`, async (): Promise<void> => {
            expect(await enabledButton4000.isEnabled()).toEqual(false);
            await browser.wait(until((): Promise<boolean> => enabledButton4000.isEnabled()), 2000)
                .catch((e): string => e);
            expect(await enabledButton4000.isEnabled()).toEqual(false);

        });

        it(` the wait Promise should be rejected when the Element is not found 
        - (test case id: 6542db81-e811-46cf-8985-9cf5ed12f4dd)`, async (): Promise<void> => {
            expect(await buttonNeverExists.isVisible()).toEqual(false);
            let error = ``;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const callback = {
                catchfn: (e: any): any => {
                    error = e;
                    return e
                }
            };
            spyOn(callback, `catchfn`).and.callThrough();
            await browser.wait(until((): Promise<boolean> => buttonNeverExists.isVisible())).catch(callback.catchfn);
            const errorMessage = `Wait timed out after 5000 ms`;

            expect(callback.catchfn).toHaveBeenCalled();
            expect(callback.catchfn).toHaveBeenCalledTimes(1);
            expect(error).toContain(errorMessage);
        });

        it(` the wait Promise should be rejected when the Element is still visible 
        - (test case id: 93b57a1f-9435-4870-b110-d32adb8fb945)`, async (): Promise<void> => {
            expect(await disappearButton10000.isVisible()).toEqual(true);
            let error = ``;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const callback = {
                catchfn: (e: any): any => {
                    error = e;
                    return e
                }
            };
            spyOn(callback, `catchfn`).and.callThrough();

            await browser.wait(until.not((): Promise<boolean> => disappearButton10000.isVisible())).catch(callback.catchfn);
            const errorMessage = `Wait timed out after 5000 ms`;

            expect(callback.catchfn).toHaveBeenCalled();
            expect(callback.catchfn).toHaveBeenCalledTimes(1);
            expect(error).toContain(errorMessage);
        });
    });

    describe(`and try to wait for an Element to be VISIBLE`, (): void => {
        let browser: Browser;
        let appearButton4000: WebElementFinder;
        let disappearButton4000: WebElementFinder;

        beforeAll((): void => {
            browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            appearButton4000 = browser.element(By.css(`[data-test-id='AppearButtonBy4000']`));
            disappearButton4000 = browser.element(By.css(`[data-test-id='DisappearButtonBy4000']`));
        });

        beforeEach((): Promise<void> => {
            return browser.get(testurl + `/delayed`);
        });

        afterAll((): Promise<void[]> => {
            return RunningBrowser.cleanup()
        });

        it(`the system should wait for 5 Seconds for the element to appear 
        - (test case id: c8d3d65d-63a5-41de-8407-b9a506c2f478)`, async (): Promise<void> => {
            expect(await appearButton4000.isVisible()).toEqual(false);
            await browser.wait(until((): Promise<boolean> => appearButton4000.isVisible()));
            expect(await appearButton4000.isVisible()).toEqual(true);

        });

        it(`the system should wait for 5 Seconds for the element to disappear 
        - (test case id: 2beb4d0f-9b90-47ec-8e54-927d452d7c5f)`, async (): Promise<void> => {
            // expect(await delayButton5000.isVisible()).toEqual(true);
            expect(await disappearButton4000.isVisible()).toEqual(true);
            await browser.wait(until.not((): Promise<boolean> => disappearButton4000.isVisible()));
            expect(await disappearButton4000.isVisible()).toEqual(false);
        }, 7000);

    });

    describe(`and try to wait for an Element to be ENABLED`, (): void => {
        let browser: Browser;
        let enabledButton4000: WebElementFinder;
        let disabledButton4000: WebElementFinder;

        beforeAll((): void => {
            browser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            enabledButton4000 = browser.element(By.css(`[data-test-id='EnabledButtonBy4000']`));
            disabledButton4000 = browser.element(By.css(`[data-test-id='DisabledButtonBy4000']`));
        });

        beforeEach((): Promise<void> => {
            return browser.get(testurl + `/delayed`);
        });

        afterAll((): Promise<void[]> => {
            return RunningBrowser.cleanup()
        });

        it(`the system should wait for 5 Seconds for the element to be enabled 
            - (test case id: a1558fb9-fdee-4775-b44d-8cd848d517b2)`, async (): Promise<void> => {
            // expect(await delayButton5000.isVisible()).toEqual(true);
            expect(await enabledButton4000.isEnabled()).toEqual(false, `the button should be disabled at first check`);
            await browser.wait(until((): Promise<boolean> => enabledButton4000.isEnabled()));
            expect(await enabledButton4000.isEnabled()).toEqual(true, `the button should be enabled after 5 seconds`);

        });

        it(`the system should wait for 5 Seconds for the element to be disabled 
            - (test case id: 010e0544-4852-4258-9729-30a2ff5ca063)`, async (): Promise<void> => {
            // expect(await delayButton5000.isVisible()).toEqual(true);
            expect(await disabledButton4000.isEnabled()).toEqual(true, `the button should be enabled at first check`);
            await browser.wait(until.not((): Promise<boolean> => disabledButton4000.isEnabled()));
            expect(await disabledButton4000.isEnabled()).toEqual(false, `the button should be disabled after 5 seconds`);

        });

    });

    afterAll(async (): Promise<void[]> => {
        return RunningBrowser.cleanup();
    })

});