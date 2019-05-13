import {
    Actor,
    BrowseTheWeb,
    RunningBrowser,
    Enter,
    Navigate,
    See,
    Key,
    Text,
    SeleniumConfig,
    UntilElement, Wait, DesiredCapabilities, Expected
}            from "../..";

import {GoogleSearch}     from "../PageObjects/GoogleSearch/GoogleSearch";
import {Add}              from "../PageObjects/GoogleCalculator/Add";
import {GoogleCalculator} from "../PageObjects/GoogleCalculator/GoogleCalculator";

let config: SeleniumConfig = {
    seleniumServerAddress: `http://localhost:4444/wd/hub`,
};

const capabilities: DesiredCapabilities = {
    browserName: `chrome`,
};

import {getLogger, configure} from "log4js";
const logger = getLogger(`Actor`);
configure(`res/config/log4js.json`);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe(`Searching on Google`, (): void => {
    let John: Actor;
    logger.trace(`actor_spec stated`);

    beforeAll((): void => {
        John = Actor.named(`John`);
        John.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(config).withDesiredCapability(capabilities)));
    });

    it(`for calculator should show the Google calculator ` +
        `- (test case id: 1761a239-3e50-408a-8e5e-1e4e6e6f07c2)`, (): Promise<void> => {

        return John.attemptsTo(
            Navigate.to(`https://www.google.de`),
            Enter.value(`calculator`).into(GoogleSearch.searchField),
            Enter.value(Key.ENTER).into(GoogleSearch.searchField),
            Wait.for(GoogleCalculator.input).andCheck(UntilElement.is.visible()),
            Add.number(1).to(5),
            See.if(Text.of(GoogleCalculator.input)).is(Expected.toEqual(`6`)),
        );

    }, 20000);

    afterAll((): Promise<void[][]> => {
        return  RunningBrowser.cleanup();
    })
});