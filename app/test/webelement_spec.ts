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
        }, 10000);

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

        fit('an error should be thrown when no element is found - (test case id: )', async () => {
            const optionListDelayed = browser.element(By.css("[data-test-id='DelayedButtonBy5000']"));

            optionListDelayed.click();

        }, 10000);
    });

    afterAll(async () => {
        await BrowserWdjs.cleanup();
    }, 10000)

});