import {BrowserFactory, By, Config, Key, UntilElement} from "../..";

describe('Using Google Search to find an online calculator', () => {
    const conf: Config = {
        browserName: "chrome",
        serverUrl: "http://localhost:4444/wd/hub",
    };
    describe('with the WebdriverJS wrapper,', () => {
        // define your elements preferably in a separate class like a page object
        const b = BrowserFactory.create(conf);
        const searchField = b.element(By.css("[name='q']"))
            .shallWait(UntilElement.isVisible().forAsLongAs(5000))
            .called("The Google search field");

        const submitSearch = b.element(By.css(".FPdoLc [name='btnK']"))
            .called("The Google Submit Search button on the main Page");

        const calculatorInput = b.element(By.css("#cwos"))
            .called("Google calculator input field")
            .shallWait(UntilElement.isVisible().forAsLongAs(5000));

        it('the google calculator should be loaded', async () => {
            await b.get("http://www.google.com");
            await searchField.sendKeys("calculator");
            await searchField.sendKeys(Key.TAB);
            await submitSearch.click();
            expect(await calculatorInput.isVisible()).toBe(true,
                "Google calculator input field not found")
        }, 20000);
    });

    afterAll(async () => {
        await BrowserFactory.cleanup();
    })
});

