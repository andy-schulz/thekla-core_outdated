import {SeleniumConfig} from "../../config/SeleniumConfig";
import {BrowserWdjs}    from "../../driver/wdjs/BrowserWdjs";
import {Browser} from "../..";

const conf: SeleniumConfig = {
    seleniumServerAddress: "http://localhost:4444/wd/hub",

    capabilities: {
        browserName: "chrome",
    }
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('When using the BrowserWdjs class', () => {
    beforeAll(async () => {
        await BrowserWdjs.cleanup();
    }, 10000);

    afterEach(async () => {
        await BrowserWdjs.cleanup();
    }, 10000);

    describe('to create a single browser', () => {
        it('with an empty browser name, it should throw an invalid browser name error ' +
            '- (test case id: f25ffac2-c583-458b-9ee1-db22a6ef0423)', async () => {
            try {
                await BrowserWdjs.create(conf,"");
                expect(true).toBeFalsy(`Creating a browser with an empty string should throw an error, but it doesnt`);
            } catch (e) {
                expect(e.toString()).toContain("invalid browser name ''");
            }
        }, 20000);

        it('with invalid browser name characters, it should throw an invalid character error ' +
            '- (test case id: cbbc5a1b-efe9-4152-800e-dab0a1ba5d8b)', async () => {
            const browserNames: string[] = ["A1 2", "!test", "$Test", "A123 "];

            browserNames.map(async (browserName: string) => {
                try {
                    await BrowserWdjs.create(conf, browserName);
                    expect(true). toBeFalsy(`Creating a browser with invalid characters should throw an error, but it doesnt!`);
                }
                catch (e) {expect(e.toString()).toMatch(/^Error: browser name (.*) contains invalid characters. Allowed characters are: (.*)/)}

            });
        }, 20000);

        it('without a name,it should be created with a default name ' +
            '- (test case id: 92f1df53-f16e-4e7d-9def-340910a2d054)', async () => {
            const browser: Browser = await BrowserWdjs.create(conf);

            expect(BrowserWdjs.availableBrowser.length).toBe(1, `length check for # of browser in BrowserWdjs failed`);
            expect(BrowserWdjs.availableBrowser[0]).toBe("browser1");
            expect(BrowserWdjs.getBrowser("browser1")).toEqual(browser);
        }, 20000);

        it('with a name, it should set this name ' +
            '- (test case id: f2e8b6f5-d639-445c-95a6-ce2ebd82a1ed)', async () => {
            const browser: Browser = await BrowserWdjs.create(conf, "theNewBrowserName");

            expect(BrowserWdjs.availableBrowser.length).toBe(1, `length check for # of browser in BrowserWdjs failed`);
            expect(BrowserWdjs.availableBrowser[0]).toBe("theNewBrowserName");
            expect(BrowserWdjs.getBrowser("theNewBrowserName")).toEqual(browser);

        }, 20000);
    });

    describe('to create multiple browser', () => {
        it('without a name, they should be created with a default name ' +
            '- (test case id: 126d1e0a-1b89-4d74-8774-69c0f446084c)', async () => {
            const browser1: Browser = await BrowserWdjs.create(conf);
            const browser2: Browser = await BrowserWdjs.create(conf);

            expect(BrowserWdjs.availableBrowser.length).toBe(2, `length check for # of browser in BrowserWdjs failed`);
            expect(BrowserWdjs.availableBrowser[0]).toBe("browser1");
            expect(BrowserWdjs.availableBrowser[1]).toBe("browser2");
            expect(BrowserWdjs.getBrowser("browser1")).toEqual(browser1);
            expect(BrowserWdjs.getBrowser("browser2")).toEqual(browser2);
        }, 20000);

        it('and only the first browser gets a name, the second browser should get a default name ' +
            '- (test case id: 83b28cf5-7fba-4597-b5ec-64495caa5053)', async () => {
            const browser1: Browser = await BrowserWdjs.create(conf, "theFirstBrowser");
            const browser2: Browser = await BrowserWdjs.create(conf);

            expect(BrowserWdjs.availableBrowser.length).toBe(2, `length check for # of browser in BrowserWdjs failed`);
            expect(BrowserWdjs.availableBrowser[0]).toBe("theFirstBrowser");
            expect(BrowserWdjs.availableBrowser[1]).toBe("browser2");
            expect(BrowserWdjs.getBrowser("theFirstBrowser")).toEqual(browser1);
            expect(BrowserWdjs.getBrowser("browser2")).toEqual(browser2);

        }, 20000);

        it('and only the second browser gets a name, the first browser should get a default name ' +
            '- (test case id: 83b28cf5-7fba-4597-b5ec-64495caa5053)', async () => {
            const browser1: Browser = await BrowserWdjs.create(conf);
            const browser2: Browser = await BrowserWdjs.create(conf, "theSecondBrowser");

            expect(BrowserWdjs.availableBrowser.length).toBe(2, `length check for # of browser in BrowserWdjs failed`);
            expect(BrowserWdjs.availableBrowser[0]).toBe("browser1");
            expect(BrowserWdjs.availableBrowser[1]).toBe("theSecondBrowser");
            expect(BrowserWdjs.getBrowser("browser1")).toEqual(browser1);
            expect(BrowserWdjs.getBrowser("theSecondBrowser")).toEqual(browser2);
        },20000);

        it('and both browser get a name, they should be set ' +
            '- (test case id: 83b28cf5-7fba-4597-b5ec-64495caa5053)', async () => {
            const browser1: Browser = await BrowserWdjs.create(conf, "theFirstBrowser");
            const browser2: Browser = await BrowserWdjs.create(conf, "theSecondBrowser");

            expect(BrowserWdjs.availableBrowser.length).toBe(2, `length check for # of browser in BrowserWdjs failed`);
            expect(BrowserWdjs.availableBrowser[0]).toBe("theFirstBrowser");
            expect(BrowserWdjs.availableBrowser[1]).toBe("theSecondBrowser");
            expect(BrowserWdjs.getBrowser("theFirstBrowser")).toEqual(browser1);
            expect(BrowserWdjs.getBrowser("theSecondBrowser")).toEqual(browser2);
        }, 20000);
    });

    describe('to delete a single browser', () => {

        afterEach(async () => {
            await BrowserWdjs.cleanup();
        });

        it('the browser map should be empty when the browser is deleted ' +
            '- (test case id: 7125c259-247f-4535-a94a-e753a82c1582)', async () => {
            const browser = await BrowserWdjs.create(conf);

            expect(BrowserWdjs.availableBrowser.length).toBe(1,
                'After creating a browser the length should be 1 but its not.');
            await BrowserWdjs.cleanup([browser]);
            expect(BrowserWdjs.availableBrowser.length).toBe(0,
                "After deleting the sole browser the # of available browser should be 0 but its not");
        });
    });

    describe('to delete multiple browser', () => {
        let browser1: Browser;
        let browser2: Browser;
        let browser3: Browser;
        let browser4: Browser;

        beforeEach(async () => {
            browser1 = await BrowserWdjs.create(conf, "browser_1");
            browser2 = await BrowserWdjs.create(conf, "browser_2");
            browser3 = await BrowserWdjs.create(conf, "browser_3");
            browser4 = await BrowserWdjs.create(conf, "browser_4");
        });

        afterEach(async () => {
            await BrowserWdjs.cleanup();
        });

        it('at once should remove the browser form the list ' +
            '- (test case id: f6ee38b0-22a9-4eb2-a9d6-7e98c635550f)', async () => {
            expect(BrowserWdjs.availableBrowser.length).toEqual(4,
                "4 browser should be available");
            await BrowserWdjs.cleanup([browser1, browser2, browser4]);
            expect(BrowserWdjs.availableBrowser.length).toEqual(1,
                "deleting 3 of 4 browser shall lead to 1 remaining browser");
            expect(BrowserWdjs.availableBrowser).toEqual(["browser_3"]);
        }, 20000);

        it('after another should remove the brower from the browser map ' +
            '- (test case id: 343a1085-4414-4e2c-8f42-c76545462dcb)', async () => {
            expect(BrowserWdjs.availableBrowser.length).toEqual(4,
                "4 browser should be available");

            // remove the first browser
            await BrowserWdjs.cleanup([browser2]);
            expect(BrowserWdjs.availableBrowser.length).toEqual(3,
                "deleting 1 of 4 browser shall lead to 3 remaining browser");
            expect(BrowserWdjs.availableBrowser).toEqual(["browser_1", "browser_3","browser_4"]);

            // remove the second browser
            await BrowserWdjs.cleanup([browser4]);
            expect(BrowserWdjs.availableBrowser.length).toEqual(2,
                "deleting 1 of 3 browser shall lead to 2 remaining browser");
            expect(BrowserWdjs.availableBrowser).toEqual(["browser_1", "browser_3"]);

            // remove the third browser
            await BrowserWdjs.cleanup([browser1]);
            expect(BrowserWdjs.availableBrowser.length).toEqual(1,
                "deleting 1 of 2 browser shall lead to 1 remaining browser");
            expect(BrowserWdjs.availableBrowser).toEqual(["browser_3"]);
        }, 20000);


        it('which dont exist, should not change the browser map ' +
            '- (test case id: 8e74188b-0a1a-41d0-ad2b-188a9a5884e4)', async () => {
            expect(BrowserWdjs.availableBrowser.length).toEqual(4,
                "4 browser should be available");

            // remove 2 browser
            await BrowserWdjs.cleanup([browser2, browser4]);
            expect(BrowserWdjs.availableBrowser.length).toEqual(2,
                "deleting 2 of 4 browser shall lead to 2 remaining browser");
            expect(BrowserWdjs.availableBrowser).toEqual(["browser_1", "browser_3"]);

            // remove the same browser
            await BrowserWdjs.cleanup([browser2, browser4]);
            expect(BrowserWdjs.availableBrowser.length).toEqual(2,
                "deleting non existing browser shall not change the browser list");
            expect(BrowserWdjs.availableBrowser).toEqual(["browser_1", "browser_3"]);

            // remove the same browser
            await BrowserWdjs.cleanup([browser2]);
            expect(BrowserWdjs.availableBrowser.length).toEqual(2,
                "deleting non existing browser shall not change the browser list");
            expect(BrowserWdjs.availableBrowser).toEqual(["browser_1", "browser_3"]);

            // remove the same browser
            await BrowserWdjs.cleanup([browser4]);
            expect(BrowserWdjs.availableBrowser.length).toEqual(2,
                "deleting non existing browser shall not change the browser list");
            expect(BrowserWdjs.availableBrowser).toEqual(["browser_1", "browser_3"]);
        }, 20000);
    });
});