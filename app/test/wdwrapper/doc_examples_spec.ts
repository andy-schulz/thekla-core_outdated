import {
    Browser,
    RunningBrowser,
    By,
    Key,
    SeleniumConfig,
    UntilElement,
    WebElementFinder,
    DesiredCapabilities
}                    from "../..";
import {BrowserWdjs} from "../../driver/wdjs/BrowserWdjs";

describe(`Using Google Search to find an online calculator`, (): void => {
    const conf: SeleniumConfig = {
        seleniumServerAddress: `http://localhost:4444/wd/hub`,
    };

    const capabilities: DesiredCapabilities = {
        browserName: `chrome`,
    };
    describe(`with the WebdriverJS wrapper,`, () => {
        // define your elements preferably in a separate class like a page object
        let b: Browser;
        let searchField: WebElementFinder;
        let submitSearch: WebElementFinder;
        let calculatorInput: WebElementFinder;

        beforeAll((): void => {
            b = BrowserWdjs.create(conf,capabilities);
            searchField = b.element(By.css(`[name='q']`))
                .shallWait(UntilElement.is.visible().forAsLongAs(5000))
                .called(`The Google search field (describe)`);

            submitSearch = b.element(By.css(`.FPdoLc [name='btnK']`))
                .called(`The Google Submit Search button on the main Page`);

            calculatorInput = b.element(By.css(`#cwos`))
                .called(`Google calculator input field`)
                .shallWait(UntilElement.is.visible().forAsLongAs(5000));
        });

        it(`the google calculator should be loaded - (test case id: 09fb5738-86b1-4f12-8d33-91bcddcde106)`, async () => {
            await b.get(`http://www.google.com`);
            await searchField.sendKeys(`calculator`);
            await searchField.sendKeys(Key.TAB);
            await submitSearch.click();
            expect(await calculatorInput.isVisible()).toBe(true,
                `Google calculator input field not found`)
        }, 20000);
    });

    afterAll(async (): Promise<void[][]> => {
        return  RunningBrowser.cleanup();
    })
});

