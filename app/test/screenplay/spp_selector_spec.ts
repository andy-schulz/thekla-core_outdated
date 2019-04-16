import {
    Actor,
    RunningBrowser,
    BrowseTheWeb,
    By,
    DesiredCapabilities,
    element,
    Navigate,
    See,
    Text,
    SeleniumConfig,
    Click,
    UntilElement, strictEqualTo
} from "../..";

import {configure} from "log4js";

configure("res/config/log4js.json");

jasmine.DEFAULT_TIMEOUT_INTERVAL=30000;

let config: SeleniumConfig = {
    seleniumServerAddress: `http://localhost:4444/wd/hub`,
    baseUrl: `http://localhost:3000`,
};

const capabilities: DesiredCapabilities = {
    browserName: `chrome`,
    proxy: {
        type: "direct"
    }
};

describe('When locating an element,', () => {
    let john: Actor;

    beforeAll(async () => {
        john = Actor.named("John");
        john.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(config).withDesiredCapability(capabilities)));
    });

    describe('by xpath', () => {
        it('the button name should be found - (test case id: 9a383bbf-9db9-41c5-b903-7f8d61bea88a)', async () => {
            const button = element(By.xpath("//button[contains(text(),'Danger!')]"))
                .shallWait(UntilElement.is.visible());

            const match = (expected: string) => (actual: string) => expect(expected).toEqual(actual);

            await john.attemptsTo(
                Navigate.to(`/`),
                See.if(Text.of(button)).is(strictEqualTo(`Danger!`)),
                Click.on(button),
            );
        }, 100000);
    });

    afterAll(async () => {
        return RunningBrowser.cleanup();
    });
});
