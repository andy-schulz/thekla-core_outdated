import "jasmine"
import {
    Browser,
    BrowserFactory,
    WebElementFinder,
    By,
    until,
    UntilElement,
    Utils,
    SeleniumConfig
}                       from "../..";
import {BrowserWdjs}    from "../../driver/wdjs/BrowserWdjs";
import {WebElementWdjs} from "../../driver/wdjs/WebElementWdjs";

import {configure} from "log4js";
configure("res/config/log4js.json");

describe('When using the Browser object', () => {
    const conf: SeleniumConfig = {
        seleniumServerAddress: "http://localhost:4444/wd/hub",

        capabilities: {
            browserName: "chrome",
            proxy: {
                type: "direct"
            }
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

    const testurl = "http://localhost:3000";


    describe('and calling the get method ', () => {
        let browser: Browser;

        beforeAll(async (done) => {
            browser = await BrowserWdjs.create(conf);
            done();
        });

        it(`with ${testurl}, it should open Google search in the browser.  - (test case id: )`, async () => {
            await browser.get(testurl);
        },10000);
    });

    describe('and calling the element function',() => {
        let browser: Browser;

        beforeAll(async () => {
            browser = await BrowserWdjs.create(conf);
            await browser.get(testurl);
        }, 10000);

        it('it should return a WebElement object  - (test case id: 3dbab3b5-a403-41ea-ad20-465c03c8f9aa)', async () => {
            const element: WebElementFinder = browser.element(By.css("[data-test-id='buttonDropDown']"));
            expect(element).toEqual(jasmine.any(WebElementWdjs));
        }, 10000);

        it('without a description a standard description should be printed - (test case id: )', () => {
            const element = browser.element(By.css(".doesNotExist"));

            const desc = element.toString();
            expect(desc).toContain(`'Element' selected by`);
            expect(desc).toContain(`.doesNotExist`);
        });

       it('without a description a standard description should be printed - (test case id: aac7ae86-287c-49d8-a76f-55a5911f0892)', () => {
            const element = browser.element(By.css(".doesNotExist")).called("My personal description");

            const desc = element.toString();
            expect(desc).toContain(`My personal description`);
            expect(desc).toContain(`.doesNotExist`);
        });
    });



    describe('and try to click on an element', async () => {
        let browser: Browser;
        let optionList: WebElementFinder;

        beforeAll(async () => {
            browser = await BrowserWdjs.create(conf);
            optionList = browser.element(By.css("[data-test-id='buttonDropDown']"));
            await browser.get(testurl);
        }, 100000);

        it('the optionList should be found and opened - (test case id: 879ded3b-ce4b-4475-aacd-310c57774f59)', async () => {
            await optionList.click();
            await Utils.wait(1000);
        }, 10000);

        it('an error should be thrown when no element is found - (test case id: f1f7e78c-6627-4014-9ed2-10ae559f22b3)', async () => {
            const optionListNotFound = browser.element(By.css("[data-test-id='DoesNotExistTestId']"));

            optionListNotFound.click().then(() => {
                expect(true).toBe(false,`The click Promise should not be fulfilled`)
            }).catch((e: any) => {
               expect(e).toContain("No Element found:")
            });

        }, 20000);

        it('an error should be thrown when no element is found - (test case id: c689b365-a1f3-4cc7-b2b7-b7c6bf851500)', async () => {
            const optionListDelayed = browser.element(By.css("[data-test-id='buttonDropDown']"));

            await optionListDelayed.click();

        }, 10000);
    });

    describe('and try to enter a String to an element', async () => {
        let browser: Browser;
        let emailInput: WebElementFinder;


        beforeAll(async () => {
            browser = await BrowserWdjs.create(conf);
            emailInput = browser.element(By.css("[data-test-id='exampleEmail']"));
            await browser.get(testurl);
        }, 100000);

        afterEach(async () => {
           await browser.get(testurl);
        });

        it('the string should be found on the value attribute - (test case id: 5cc595d1-3da0-4418-8a8f-b63b6f909f04)', async () => {
            const emailString = "a.b@c.de";
            await emailInput.sendKeys(emailString);
            expect(await emailInput.getAttribute("value")).toEqual(emailString);
        }, 20000);

        it('the string should not be found with the getText() Method - (test case id: 5e02cf2a-94c1-487a-a152-05722c67797f)', async () => {
            const emailString = "a.b@c.de";
            await emailInput.sendKeys(emailString);
            expect(await emailInput.getText()).toEqual("");
            await Utils.wait(2000);
        }, 20000);
    });

    describe('and try to wait for an Element', async () => {
        let browser: Browser;
        let appearButton5000: WebElementFinder;
        let appearButton10000: WebElementFinder;
        let disappearButton5000: WebElementFinder;
        let disappearButton10000: WebElementFinder;
        let buttonNeverExists: WebElementFinder;


        beforeAll(async () => {
            browser = await BrowserWdjs.create(conf);
            appearButton5000 = browser.element(By.css("[data-test-id='AppearButtonBy5000']"));
            disappearButton5000 = browser.element(By.css("[data-test-id='DisappearButtonBy5000']"));
            appearButton10000 = browser.element(By.css("[data-test-id='AppearButtonBy10000']"));
            disappearButton10000 = browser.element(By.css("[data-test-id='DisappearButtonBy10000']"));
            buttonNeverExists = browser.element(By.css("[data-test-id='neverExists']"));
        });

        beforeEach(async () => {
            await browser.get(testurl + "/delayed");
        },11000);

        it('the system should wait fo 5 Seconds for the element to appear - (test case id: c8d3d65d-63a5-41de-8407-b9a506c2f478)', async () => {
            // expect(await delayButton5000.isVisible()).toEqual(true);
            expect(await appearButton5000.isVisible()).toEqual(false);
            await browser.wait(until(() => appearButton5000.isVisible()));
            expect(await appearButton5000.isVisible()).toEqual(true);

        }, 20000);

        it('the system should wait fo 5 Seconds and then timout - (test case id: c004412c-9e79-4df4-8af6-ea079318769d)', async () => {
            // expect(await delayButton5000.isVisible()).toEqual(true);
            expect(await appearButton10000.isVisible()).toEqual(false);
            await browser.wait(until(() => appearButton10000.isVisible())).catch(e => e);
            expect(await appearButton10000.isVisible()).toEqual(false);

        }, 20000);

        it(' the wait Promise should be rejected when the Element is not found - (test case id: 6542db81-e811-46cf-8985-9cf5ed12f4dd)', async () => {
            expect(await buttonNeverExists.isVisible()).toEqual(false);
            let error = "";

            const callback = {catchfn: (e: any) => {error = e; return e}};
            spyOn(callback, "catchfn").and.callThrough();
            await browser.wait(until(() => buttonNeverExists.isVisible())).catch(callback.catchfn);
            const errorMessage = "Wait timed out after 5000 ms";

            expect(callback.catchfn).toHaveBeenCalled();
            expect(callback.catchfn).toHaveBeenCalledTimes(1);
            expect(error).toContain(errorMessage);
        }, 20000);

        it('the system should wait fo 5 Seconds for the element to disappear - (test case id: 2beb4d0f-9b90-47ec-8e54-927d452d7c5f)', async () => {
            // expect(await delayButton5000.isVisible()).toEqual(true);
            expect(await disappearButton5000.isVisible()).toEqual(true);
            await browser.wait(until.not(() => disappearButton5000.isVisible()));
            expect(await disappearButton5000.isVisible()).toEqual(false);
        }, 20000);

        it(' the wait Promise should be rejected when the Element is still visible - (test case id: 93b57a1f-9435-4870-b110-d32adb8fb945)', async () => {
            expect(await disappearButton10000.isVisible()).toEqual(true);
            let error = "";

            const callback = {catchfn: (e: any) => {error = e; return e}};
            spyOn(callback, "catchfn").and.callThrough();

            await browser.wait(until.not(() => disappearButton10000.isVisible())).catch(callback.catchfn);
            const errorMessage = "Wait timed out after 5000 ms";

            expect(callback.catchfn).toHaveBeenCalled();
            expect(callback.catchfn).toHaveBeenCalledTimes(1);
            expect(error).toContain(errorMessage);
        }, 20000);
    });


    describe('and work with the title', async () => {
        let browser: Browser;


        beforeAll(async () => {
            browser = await BrowserWdjs.create(conf);
        });

        beforeEach(async () => {
            await browser.get(testurl);
        },11000);

        it('the getTitle method should get the correct title - (test case id: 69c764e0-ad69-4bdf-b2a1-fd259ea57d04)', async () => {
            expect(await browser.getTitle()).toEqual("React App");
        }, 5000);

        it('the hasTitle method should test for the correct title - (test case id: 32a63a6a-cd0d-43e8-8806-3f4a9b07614d)', async () => {
            expect(await browser.hasTitle("React App")).toEqual(true);
        }, 5000);

        it('the hasTitle method should return false when the given title is not correct. - (test case id: 03314fd1-dd48-474c-be45-7360853c3ff5)', async () => {
            expect(await browser.hasTitle("ReactApp")).toEqual(false);
        }, 5000);
    });

    afterAll(async () => {
        return BrowserFactory.cleanup();
    }, 21000)

});