import {
    Actor,
    RunningBrowser,
    BrowseTheWeb,
    By,
    Click,
    DesiredCapabilities,
    element,
    Enter,
    Key,
    Navigate,
    See,
    Text,
    UntilElement,
    SeleniumConfig, Expected
} from "../..";

class GooglePgo {
    // define your elements in a page object
    public static searchField = element(By.css("[name='q']"))
        .shallWait(UntilElement.is.visible().forAsLongAs(5000))
        .called("The Google search field (GPO)");

    public static submitSearch = element(By.css(".FPdoLc [name='btnK']"))
        .called("The Google Submit Search button on the main Page");

    public static calculatorInput = element(By.css("#cwos"))
        .called("Google calculator input field")
        .shallWait(UntilElement.is.visible().forAsLongAs(5000));
}

import {getLogger, configure} from "log4js";
const logger = getLogger("DocSppExamples");

describe('Using Google Search to find an online calculator', () => {
    const conf: SeleniumConfig = {
        seleniumServerAddress: "http://localhost:4444/wd/hub",
    };

    const capabilities: DesiredCapabilities = {
        browserName: "chrome",
    };

    describe('with the screenplay pattern implementation,', () => {
        // define your actor
        const philipp = Actor.named("Philipp");

        // using the jasmine matcher for our checks on the UI
        const match = (expected: string) => (actual: string) => expect(actual).toEqual(expected);

        beforeAll(async () => {
            // and give him the ability to browse the web using a browser of your choice
            philipp.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(conf).withDesiredCapability(capabilities)));
        });

        it('the google calculator should be loaded - (test case id: ee1fcbb5-eb08-4f0d-979b-601ba9b63d87)', async () => {
            return philipp.attemptsTo(
                Navigate.to("http://www.google.com"),
                Enter.value("calculator").into(GooglePgo.searchField),
                Enter.value(Key.TAB).into(GooglePgo.searchField),
                Click.on(GooglePgo.submitSearch),
                See.if(Text.of(GooglePgo.calculatorInput)).is(Expected.toEqual("0"))
            )
        }, 20000);
    });

    afterAll(async () => {
        // close all Browsers which were created during the test
        return RunningBrowser.cleanup();
    })
});

