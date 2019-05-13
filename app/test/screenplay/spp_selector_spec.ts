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
    UntilElement, Expected
} from "../..";

import {configure} from "log4js";

configure(`res/config/log4js.json`);

jasmine.DEFAULT_TIMEOUT_INTERVAL=30000;

let config: SeleniumConfig = {
    seleniumServerAddress: `http://localhost:4444/wd/hub`,
    baseUrl: `http://localhost:3000`,
};

const capabilities: DesiredCapabilities = {
    browserName: `chrome`,
    proxy: {
        type: `direct`
    }
};

describe(`When locating an element,`, (): void => {
    let john: Actor;

    beforeAll((): void => {
        john = Actor.named(`John`);
        john.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(config).withDesiredCapability(capabilities)));
    });

    describe(`by xpath`, () => {
        it(`the button name should be found - (test case id: 9a383bbf-9db9-41c5-b903-7f8d61bea88a)`,() => {
            const button = element(By.xpath(`//button[contains(text(),'Danger!')]`))
                .shallWait(UntilElement.is.visible());

            return  john.attemptsTo(
                Navigate.to(`/`),
                See.if(Text.of(button)).is(Expected.toEqual(`Danger!`)),
                Click.on(button),
            );
        }, 100000);
    });

    afterAll(async (): Promise<void[][]> => {
        return RunningBrowser.cleanup();
    });
});
