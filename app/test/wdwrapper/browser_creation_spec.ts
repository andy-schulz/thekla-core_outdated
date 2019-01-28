import {SeleniumConfig} from "../../config/SeleniumConfig";
import {BrowserWdjs}    from "../../driver/wdjs/BrowserWdjs";
import {Browser} from "../..";

const conf: SeleniumConfig = {
    seleniumServerAddress: "http://localhost:4444/wd/hub",

    capabilities: {
        browserName: "chrome",
    }
};

describe('When using the BrowserWdjs class', () => {
    beforeAll(async () => {
        await BrowserWdjs.cleanup();
    }, 10000);

    afterEach(async () => {
        await BrowserWdjs.cleanup();
    }, 10000);

    describe('to create a single browser', () => {
        it('with an empty browser name, it should throw an invalid browser name error - (test case id: f25ffac2-c583-458b-9ee1-db22a6ef0423)', () => {
            try {
                BrowserWdjs.create(conf,"");
                expect(true).toBeFalsy(`Creating a browser with an empty string should throw an error, but it doesnt`);
            } catch (e) {
                expect(e.toString()).toContain("invalid browser name ''");
            }
        }, 20000);

        it('with invalid browser name characters, it should throw an invalid character error - (test case id: cbbc5a1b-efe9-4152-800e-dab0a1ba5d8b)', () => {
            const browserNames: string[] = ["A1 2", "!test", "$Test", "A123 "];

            browserNames.map((browserName: string) => {
                try {
                    BrowserWdjs.create(conf, browserName);
                    expect(true). toBeFalsy(`Creating a browser with invalid characters should throw an error, but it doesnt!`);
                }
                catch (e) {expect(e.toString()).toMatch(/^Error: browser name (.*) contains invalid characters. Allowed characters are: (.*)/)}

            });
        }, 20000);

        it('without a name,it should be created with a default name ' +
            '- (test case id: 92f1df53-f16e-4e7d-9def-340910a2d054)', () => {
            const browser: Browser = BrowserWdjs.create(conf);

            expect(BrowserWdjs.availableBrowser().length).toBe(1, `length check for # of browser in BrowserWdjs failed`);
            expect(BrowserWdjs.availableBrowser()[0]).toBe("browser1");
            expect(BrowserWdjs.getBrowser("browser1")).toEqual(browser);
        }, 20000);

        it('with a name, it should set this name ' +
            '- (test case id: f2e8b6f5-d639-445c-95a6-ce2ebd82a1ed)', () => {
            const browser: Browser = BrowserWdjs.create(conf, "theNewBrowserName");

            expect(BrowserWdjs.availableBrowser().length).toBe(1, `length check for # of browser in BrowserWdjs failed`);
            expect(BrowserWdjs.availableBrowser()[0]).toBe("theNewBrowserName");
            expect(BrowserWdjs.getBrowser("theNewBrowserName")).toEqual(browser);

        }, 20000);
    });

    describe('to create multiple browser', () => {
        it('without a name, they should be created with a default name ' +
            '- (test case id: 126d1e0a-1b89-4d74-8774-69c0f446084c)', () => {
            const browser1: Browser = BrowserWdjs.create(conf);
            const browser2: Browser = BrowserWdjs.create(conf);

            expect(BrowserWdjs.availableBrowser().length).toBe(2, `length check for # of browser in BrowserWdjs failed`);
            expect(BrowserWdjs.availableBrowser()[0]).toBe("browser1");
            expect(BrowserWdjs.availableBrowser()[1]).toBe("browser2");
            expect(BrowserWdjs.getBrowser("browser1")).toEqual(browser1);
            expect(BrowserWdjs.getBrowser("browser2")).toEqual(browser2);
        }, 20000);

        it('and only the first browser gets a name, the second browser should get a default name ' +
            '- (test case id: 83b28cf5-7fba-4597-b5ec-64495caa5053)', () => {
            const browser1: Browser = BrowserWdjs.create(conf, "theFirstBrowser");
            const browser2: Browser = BrowserWdjs.create(conf);

            expect(BrowserWdjs.availableBrowser().length).toBe(2, `length check for # of browser in BrowserWdjs failed`);
            expect(BrowserWdjs.availableBrowser()[0]).toBe("theFirstBrowser");
            expect(BrowserWdjs.availableBrowser()[1]).toBe("browser2");
            expect(BrowserWdjs.getBrowser("theFirstBrowser")).toEqual(browser1);
            expect(BrowserWdjs.getBrowser("browser2")).toEqual(browser2);

        }, 20000);

        it('and only the second browser gets a name, the first browser should get a default name ' +
            '- (test case id: 83b28cf5-7fba-4597-b5ec-64495caa5053)', () => {
            const browser1: Browser = BrowserWdjs.create(conf);
            const browser2: Browser = BrowserWdjs.create(conf, "theSecondBrowser");

            expect(BrowserWdjs.availableBrowser().length).toBe(2, `length check for # of browser in BrowserWdjs failed`);
            expect(BrowserWdjs.availableBrowser()[0]).toBe("browser1");
            expect(BrowserWdjs.availableBrowser()[1]).toBe("theSecondBrowser");
            expect(BrowserWdjs.getBrowser("browser1")).toEqual(browser1);
            expect(BrowserWdjs.getBrowser("theSecondBrowser")).toEqual(browser2);
        },20000);

        it('and both browser get a name, they should be set ' +
            '- (test case id: 83b28cf5-7fba-4597-b5ec-64495caa5053)', () => {
            const browser1: Browser = BrowserWdjs.create(conf, "theFirstBrowser");
            const browser2: Browser = BrowserWdjs.create(conf, "theSecondBrowser");

            expect(BrowserWdjs.availableBrowser().length).toBe(2, `length check for # of browser in BrowserWdjs failed`);
            expect(BrowserWdjs.availableBrowser()[0]).toBe("theFirstBrowser");
            expect(BrowserWdjs.availableBrowser()[1]).toBe("theSecondBrowser");
            expect(BrowserWdjs.getBrowser("theFirstBrowser")).toEqual(browser1);
            expect(BrowserWdjs.getBrowser("theSecondBrowser")).toEqual(browser2);
        }, 20000);
    });
});