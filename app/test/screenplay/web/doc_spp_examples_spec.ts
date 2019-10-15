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
    ServerConfig, Expected
}                                                                               from "../../../index";
import {getLogger}                                                              from "log4js";
import {setBrowserStackSessionName, standardCapabilities, standardServerConfig} from "../../0_helper/config";
import {cloneDeep}                                                              from "lodash";

class GooglePgo {
    // define your elements in a page object
    public static searchField = element(By.css(`[name='q']`))
        .shallWait(UntilElement.is.visible().forAsLongAs(5000))
        .called(`The Google search field (GPO)`);

    public static submitSearch = element(By.css(`.FPdoLc [name='btnK']`))
        .called(`The Google Submit Search button on the main Page`);

    public static calculatorInput = element(By.css(`#cwos`))
        .called(`Google calculator input field`)
        .shallWait(UntilElement.is.visible().forAsLongAs(5000));
}

const logger = getLogger(`DocSppExamples`);

describe(`Using Google Search to find an online calculator`, (): void => {
    logger.trace(`Start Google Search test`);

    const conf: ServerConfig = cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = cloneDeep(standardCapabilities);
    setBrowserStackSessionName(capabilities, `doc_spp_examples_spec.ts`);

    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
    });

    describe(`with the screenplay pattern implementation,`, (): void => {
        // define your actor
        const philipp = Actor.named(`Philipp`);

        beforeAll((): void => {
            // and give him the ability to browse the web using a browser of your choice
            philipp.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(conf).withCapabilities(capabilities)));
        });

        it(`the google calculator should be loaded - (test case id: ee1fcbb5-eb08-4f0d-979b-601ba9b63d87)`, async (): Promise<void> => {
            return philipp.attemptsTo(
                Navigate.to(`http://www.google.com`),
                Enter.value(`calculator`).into(GooglePgo.searchField),
                Enter.value(Key.TAB).into(GooglePgo.searchField),
                Click.on(GooglePgo.submitSearch),
                See.if(Text.of(GooglePgo.calculatorInput)).is(Expected.toEqual(`0`))
            )
        });
    });

    afterAll(async (): Promise<void[]> => {
        // close all Browsers which were created during the test
        return RunningBrowser.cleanup();
    })
});

