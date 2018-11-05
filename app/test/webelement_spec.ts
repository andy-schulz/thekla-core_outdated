import "jasmine"
import {Config} from "../interface/Config";
import {BrowserWdjs} from "../src/wdjs/BrowserWdjs";
import {Browser} from "../interface/Browser";
import {WebElementWdjs} from "../src/wdjs/WebElementWdjs";
import {Utils} from "../src/utils/Utils";
import {WebElementFinder} from "../interface/WebElements";
import {By} from "../interface/Locator";

describe('When using the Browser object', () => {
    const conf: Config = {
        browserName: "firefox",
        serverUrl: "http://localhost:4444/wd/hub",
        firefoxOptions: {
            binary: "C:\\PProgramme\\FirefoxPortable\\App\\Firefox\\firefox.exe"
        }
        // chromeOptions: {
        //     binary: "C:\\PProgramme\\GoogleChromePortable64\\App\\Chrome-bin\\chrome.exe"
        // }
    };
    const testurl = "http://localhost:3000/";


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

        it('it should return a WebElementWdjs object  - (test case id: )', async () => {
            const element: WebElementFinder = browser.element(By.css("[data-test-id='buttonDropDown']"));
            expect(element).toEqual(jasmine.any(WebElementWdjs));
        }, 10000);

        it('with a description it should be printable - (test case id: )', () => {
            const element = browser.element(By.css(".doesNotExist"), `My personal description`);

            const desc = element.getDescription();
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

        it('the optionList should be found and opened - (test case id: )', async () => {
            await optionList.click();
            await Utils.wait(1000);
        }, 10000);

        it('an error should be thrown when no element is found - (test case id: )', async () => {
            const optionListNotFound = browser.element(By.css("[data-test-id='DoesNotExistTestId']"));

            optionListNotFound.click().then(() => {
                expect(true).toBe(false,`The click Promise should not be fulfilled`)
            }).catch((e: any) => {
               expect(e).toContain("No Element found:")
            });

        }, 20000);

        it('an error should be thrown when no element is found - (test case id: )', async () => {
            // const optionListDelayed = browser.element(By.css("[data-test-id='DelayedButtonBy5000']"));
            const optionListDelayed = browser.element(By.css("[data-test-id='buttonDropDown']"));

            await optionListDelayed.click();

        }, 10000);
    });

    fdescribe('and try to enter a String to an element', async () => {
        let browser: Browser;
        let emailInput: WebElementFinder;


        beforeAll(async () => {
            browser = await BrowserWdjs.create(conf);
            emailInput = browser.element(By.css("[data-test-id='exampleEmail']"));
            await browser.get(testurl);
        }, 100000);

        it('the string should be found on the value attribute - (test case id: )', async () => {
            const emailString = "a.b@c.de";
            await emailInput.sendKeys(emailString);
            expect(await emailInput.getAttribute("value")).toEqual(emailString);
        }, 20000);

        it('the string should not be found with the getText() Method - (test case id: )', async () => {
            const emailString = "a.b@c.de";
            await emailInput.sendKeys(emailString);
            expect(await emailInput.getText()).toEqual("");
            await Utils.wait(2000);
        }, 20000);
    });

    afterAll(async () => {
        await BrowserWdjs.cleanup();
    }, 10000)

});