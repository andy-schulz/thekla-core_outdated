import {
    Browser,
    RunningBrowser,
    By,
    Key,
    ServerConfig,
    UntilElement,
    WebElementFinder,
    DesiredCapabilities, ClientHelper
}                                                                               from "../..";
import {setBrowserStackSessionName, standardCapabilities, standardServerConfig} from "../0_helper/config";
import {cloneDeep}                                                              from "lodash";

describe(`Using Google Search to find an online calculator`, (): void => {

    const conf: ServerConfig = cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = cloneDeep(standardCapabilities);
    setBrowserStackSessionName(capabilities, `doc_examples_spec.ts`);

    describe(`with the WebdriverJS wrapper,`, (): void => {
        // define your elements preferably in a separate class like a page object
        let b: Browser;
        let searchField: WebElementFinder;
        let submitSearch: WebElementFinder;
        let calculatorInput: WebElementFinder;

        beforeAll((): void => {
            b = ClientHelper.create(conf, capabilities);
            searchField = b.element(By.css(`[name='q']`))
                .shallWait(UntilElement.is.visible().forAsLongAs(5000))
                .called(`The Google search field (describe)`);

            submitSearch = b.element(By.css(`.FPdoLc [name='btnK']`))
                .called(`The Google Submit Search button on the main Page`);

            calculatorInput = b.element(By.css(`#cwos`))
                .called(`Google calculator input field`)
                .shallWait(UntilElement.is.visible().forAsLongAs(5000));
        });

        it(`the google calculator should be loaded - (test case id: 09fb5738-86b1-4f12-8d33-91bcddcde106)`, async (): Promise<void> => {
            await b.get(`http://www.google.com`);
            await searchField.sendKeys(`calculator`);
            await searchField.sendKeys(Key.TAB);
            await submitSearch.click();
            expect(await calculatorInput.isVisible()).toBe(true,
                `Google calculator input field not found`)
        }, 20000);
    });

    afterAll(async (): Promise<void[]> => {
        return RunningBrowser.cleanup();
    })
});

