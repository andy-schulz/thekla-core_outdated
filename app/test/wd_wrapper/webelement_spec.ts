import "jasmine"
import {
    Browser,
    RunningBrowser,
    WebElementFinder,
    By,
    until,
    Utils,
    SeleniumConfig, DesiredCapabilities
}                       from "../..";
import {BrowserWdjs}    from "../../driver/wdjs/BrowserWdjs";
import {WdElement}      from "../../driver/wdjs/interfaces/WdElement";
import {WebElementWdjs} from "../../driver/wdjs/WebElementWdjs";

import {configure}                   from "log4js";
import {BoundaryCheck, boundingRect} from "../0_helper/browser_viewport";
configure(`res/config/log4js.json`);

describe(`When using the Browser object`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    const conf: SeleniumConfig = {
        seleniumServerAddress: `http://localhost:4444/wd/hub`,
        baseUrl: `https://teststepsframeworktester.azurewebsites.net`
    };

    const capabilities: DesiredCapabilities = {
        browserName: `firefox`,
        proxy: {
            type: `system`
        }
    };
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

    const testurl = `https://teststepsframeworktester.azurewebsites.net`;


    describe(`and calling the get method `, (): void => {
        let browser: Browser;

        beforeAll((): void => {
            browser = BrowserWdjs.create(conf, capabilities);
        });

        it(`with ${testurl}, it should open the URL in the browser.  
        - (test case id: 7767cdde-846e-40c8-9476-adb133516cb0)`,async (): Promise<void> => {
            await  browser.get(testurl);
            expect(await browser.getCurrentUrl()).toContain(testurl);
        });
    });

    describe(`and calling the element function`,(): void => {
        let browser: Browser;

        beforeAll((): Promise<void> => {
            browser = BrowserWdjs.create(conf, capabilities);
            return browser.get(testurl);
        });

        it(`it should return a WebElement object  
        - (test case id: 3dbab3b5-a403-41ea-ad20-465c03c8f9aa)`, (): void => {
            const element: WebElementFinder = browser.element(By.css(`[data-test-id='buttonDropDown']`));
            expect(element).toEqual(jasmine.any(WebElementWdjs));
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

    describe(`and try to click on an element`,(): void => {
        let browser: Browser;
        let optionList: WebElementFinder;

        beforeAll((): Promise<void> => {
            browser = BrowserWdjs.create(conf, capabilities);
            optionList = browser.element(By.css(`[data-test-id='buttonDropDown']`));
            return browser.get(testurl);
        });

        it(`the optionList should be found and opened 
        - (test case id: 879ded3b-ce4b-4475-aacd-310c57774f59)`, async (): Promise<void> => {
            await optionList.click();
            await Utils.wait(1000);
        });

        it(`an error should be thrown when no element is found 
        - (test case id: f1f7e78c-6627-4014-9ed2-10ae559f22b3)`,(): Promise<void> => {
            const optionListNotFound = browser.element(By.css(`[data-test-id='DoesNotExistTestId-f1f7e78c']`));

            return optionListNotFound.click()
                .then((): void => {
                    expect(true).toBe(false,`The click Promise should not be fulfilled`)
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
            browser = BrowserWdjs.create(conf, capabilities);
            hoverElement = browser.element(By.css(`[data-test-id='usericon']`));
            userName = browser.element(By.css(`[data-test-id='hoverusername']`));
            button = browser.element(By.css(`[data-test-id='button']`));
            return browser.get(testurl);
        });

        it(`the optionList should be found and opened 
        - (test case id: 879ded3b-ce4b-4475-aacd-310c57774f59)`, async (): Promise<void> => {

            expect(await userName.isVisible()).toBe(false);
            await hoverElement.hover();
            expect(await userName.isVisible()).toBe(true);
            await button.hover();
            expect(await userName.isVisible()).toBe(false);

            await Utils.wait(5000);
        });
    });

    describe(`and try to scroll an element into view`, () => {
        let browser: Browser;
        let lastTableRow: WebElementFinder;

        beforeAll((): Promise<void> => {
            browser = BrowserWdjs.create(conf, capabilities);
            lastTableRow = browser.element(By.css(`[data-test-id='lastTableRow']`));

            return browser.get(`/tables`);
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
            browser = BrowserWdjs.create(conf, capabilities);
            emailInput = browser.element(By.css(`[data-test-id='exampleEmail']`));
            return browser.get(testurl);
        });

        afterEach((): Promise<void> => {
            return  browser.get(testurl);
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
        let enabledButton5000: WebElementFinder;

        beforeAll((): void => {
            browser = BrowserWdjs.create(conf, capabilities);
            appearButton10000 = browser.element(By.css(`[data-test-id='AppearButtonBy10000']`));
            buttonNeverExists = browser.element(By.css(`[data-test-id='neverExists']`));
            disappearButton10000 = browser.element(By.css(`[data-test-id='DisappearButtonBy10000']`));
            enabledButton5000 = browser.element(By.css(`[data-test-id='EnabledButtonBy5000']`));
        });

        beforeEach((): Promise<void> => {
            return  browser.get(testurl + `/delayed`);
        });

        it(`the system should wait for 5 Seconds and then timout 
        - (test case id: c004412c-9e79-4df4-8af6-ea079318769d)`, async (): Promise<void> => {
            expect(await appearButton10000.isVisible()).toEqual(false);
            await browser.wait(until((): Promise<boolean> => appearButton10000.isVisible())).catch((e): string => e);
            expect(await appearButton10000.isVisible()).toEqual(false);

        });

        it(`the system should wait for 5 Seconds and then timout 
        - (test case id: c004412c-9e79-4df4-8af6-ea079318769d)`, async (): Promise<void> => {
            expect(await enabledButton5000.isEnabled()).toEqual(false);
            await browser.wait(until((): Promise<boolean> => enabledButton5000.isEnabled()),2000)
                .catch((e): string => e);
            expect(await enabledButton5000.isEnabled()).toEqual(false);

        });

        it(` the wait Promise should be rejected when the Element is not found 
        - (test case id: 6542db81-e811-46cf-8985-9cf5ed12f4dd)`, async (): Promise<void> => {
            expect(await buttonNeverExists.isVisible()).toEqual(false);
            let error = ``;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const callback = {catchfn: (e: any): any => {error = e; return e}};
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
            const callback = {catchfn: (e: any): any => {error = e; return e}};
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
        let appearButton5000: WebElementFinder;
        let disappearButton5000: WebElementFinder;


        beforeAll((): void => {
            browser = BrowserWdjs.create(conf, capabilities);
            appearButton5000 = browser.element(By.css(`[data-test-id='AppearButtonBy5000']`));
            disappearButton5000 = browser.element(By.css(`[data-test-id='DisappearButtonBy5000']`));
        });

        beforeEach((): Promise<void> => {
            return  browser.get(testurl + `/delayed`);
        });

        it(`the system should wait for 5 Seconds for the element to appear 
        - (test case id: c8d3d65d-63a5-41de-8407-b9a506c2f478)`, async (): Promise<void> => {
            expect(await appearButton5000.isVisible()).toEqual(false);
            await browser.wait(until((): Promise<boolean> => appearButton5000.isVisible()));
            expect(await appearButton5000.isVisible()).toEqual(true);

        });

        it(`the system should wait for 5 Seconds for the element to disappear 
        - (test case id: 2beb4d0f-9b90-47ec-8e54-927d452d7c5f)`, async (): Promise<void> => {
            // expect(await delayButton5000.isVisible()).toEqual(true);
            expect(await disappearButton5000.isVisible()).toEqual(true);
            await browser.wait(until.not((): Promise<boolean> => disappearButton5000.isVisible()));
            expect(await disappearButton5000.isVisible()).toEqual(false);
        });

    });

    describe(`and try to wait for an Element to be ENABLED`, (): void => {
        let browser: Browser;
        let enabledButton5000: WebElementFinder;
        let disabledButton5000: WebElementFinder;


        beforeAll((): void => {
            browser = BrowserWdjs.create(conf, capabilities);
            enabledButton5000 = browser.element(By.css(`[data-test-id='EnabledButtonBy5000']`));
            disabledButton5000 = browser.element(By.css(`[data-test-id='DisabledButtonBy5000']`));
        });

        beforeEach((): Promise<void> => {
            return browser.get(testurl + `/delayed`);
        });

        it(`the system should wait for 5 Seconds for the element to be enabled 
            - (test case id: a1558fb9-fdee-4775-b44d-8cd848d517b2)`, async (): Promise<void> => {
            // expect(await delayButton5000.isVisible()).toEqual(true);
            expect(await enabledButton5000.isEnabled()).toEqual(false, `the button should be disabled at first check`);
            await browser.wait(until((): Promise<boolean> => enabledButton5000.isEnabled()));
            expect(await enabledButton5000.isEnabled()).toEqual(true, `the button should be enabled after 5 seconds`);

        });

        it(`the system should wait for 5 Seconds for the element to be disabled 
            - (test case id: 010e0544-4852-4258-9729-30a2ff5ca063)`, async (): Promise<void> => {
            // expect(await delayButton5000.isVisible()).toEqual(true);
            expect(await disabledButton5000.isEnabled()).toEqual(true, `the button should be enabled at first check`);
            await browser.wait(until.not((): Promise<boolean> => disabledButton5000.isEnabled()));
            expect(await disabledButton5000.isEnabled()).toEqual(false, `the button should be disabled after 5 seconds`);

        });

    });

    describe(`and work with the title`, (): void => {
        let browser: Browser;

        beforeAll( (): void => {
            browser = BrowserWdjs.create(conf, capabilities);
        });

        beforeEach( (): Promise<void> => {
            return  browser.get(testurl);
        });

        it(`the getTitle method should get the correct title 
        - (test case id: 69c764e0-ad69-4bdf-b2a1-fd259ea57d04)`, async (): Promise<void> => {
            expect(await browser.getTitle()).toEqual(`React App`);
        });

        it(`the hasTitle method should test for the correct title 
        - (test case id: 32a63a6a-cd0d-43e8-8806-3f4a9b07614d)`, async (): Promise<void> => {
            expect(await browser.hasTitle(`React App`)).toEqual(true);
        });

        it(`the hasTitle method should return false when the given title is not correct. 
        - (test case id: 03314fd1-dd48-474c-be45-7360853c3ff5)`, async (): Promise<void> => {
            expect(await browser.hasTitle(`ReactApp`)).toEqual(false);
        });
    });

    afterAll(async (): Promise<void[][]> => {
        return RunningBrowser.cleanup();
    })

});