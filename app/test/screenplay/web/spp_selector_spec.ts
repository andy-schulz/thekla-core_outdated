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
    ServerConfig,
    Click,
    UntilElement, Expected
}                  from "../../../index";

import {configure}                                  from "log4js";
import {standardCapabilities, standardServerConfig} from "../../0_helper/config";

configure(`res/config/log4js.json`);

describe(`When locating an element,`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL=30000;

    let config: ServerConfig = standardServerConfig;

    const capabilities: DesiredCapabilities = standardCapabilities;

    let john: Actor;

    beforeAll((): void => {
        john = Actor.named(`John`);
        john.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(config).withCapabilities(capabilities)));
    });

    describe(`by xpath`, (): void => {

        it(`the button name should be found 
        - (test case id: 9a383bbf-9db9-41c5-b903-7f8d61bea88a)`,(): Promise<void> => {
            const button = element(By.xpath(`//button[contains(text(),'Danger!')]`))
                .shallWait(UntilElement.is.visible());

            return  john.attemptsTo(
                Navigate.to(`/`),
                See.if(Text.of(button)).is(Expected.toEqual(`Danger!`)),
                Click.on(button),
            );
        }, 100000);

        it(`the button name should be found 
        - (test case id: 9a383bbf-9db9-41c5-b903-7f8d61bea88a)`,(): Promise<void> => {
            const button = element(By.cssContainingText(`button`, `Danger!`))
                .shallWait(UntilElement.is.visible());

            return  john.attemptsTo(
                Navigate.to(`/`),
                See.if(Text.of(button)).is(Expected.toEqual(`Danger!`)),
                Click.on(button),
            );
        }, 100000);
    });

    afterAll(async (): Promise<void[]> => {
        return RunningBrowser.cleanup();
    });
});
