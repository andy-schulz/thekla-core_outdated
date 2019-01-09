import {Browser, BrowserFactory, By, CapabilitiesWdjs, Key, UntilElement, WebElementFinder} from "../..";
import {BrowserWdjs}                                                                        from "../../driver/wdjs/BrowserWdjs";

describe('Using Google Search to find an online calculator', () => {
    const conf: CapabilitiesWdjs = {
        browserName: "chrome",
        serverUrl: "http://localhost:4444/wd/hub",
    };
    describe('with the WebdriverJS wrapper,', () => {
        // define your elements preferably in a separate class like a page object
        let b: Browser;
        let searchField: WebElementFinder;
        let submitSearch: WebElementFinder;
        let calculatorInput:WebElementFinder;

        beforeAll(() => {
            b = BrowserWdjs.create(conf);
            searchField = b.element(By.css("[name='q']"))
                .shallWait(UntilElement.isVisible().forAsLongAs(5000))
                .called("The Google search field (describe)");

            submitSearch = b.element(By.css(".FPdoLc [name='btnK']"))
                .called("The Google Submit Search button on the main Page");

            calculatorInput = b.element(By.css("#cwos"))
                .called("Google calculator input field")
                .shallWait(UntilElement.isVisible().forAsLongAs(5000));
        });

        it('the google calculator should be loaded - (test case id: 09fb5738-86b1-4f12-8d33-91bcddcde106)', async () => {
            await b.get("http://www.google.com");
            await searchField.sendKeys("calculator");
            await searchField.sendKeys(Key.TAB);
            await submitSearch.click();
            expect(await calculatorInput.isVisible()).toBe(true,
                "Google calculator input field not found")
        }, 20000);
    });

    afterAll(async () => {
        return  BrowserFactory.cleanup();
    })
});

