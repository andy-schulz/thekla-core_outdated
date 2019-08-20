import {LogLevel} from "../../../config/ServerConfig";
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
}                 from "../../../index";

import {configure} from "log4js";

configure(`res/config/log4js.json`);




describe(`When locating an element,`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL=30000;

    let config: ServerConfig = {
        automationFramework: {
            type: process.env.FRAMEWORK === `wdio` ? `wdio` : `wdjs`,
            logLevel: (process.env.LOGLEVEL ? process.env.LOGLEVEL : `warn`) as LogLevel
        },
        serverAddress: {
            hostname: `localhost`
        },
        baseUrl: process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`,
    };

    const capabilities: DesiredCapabilities = {
        browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
        proxy: {
            type: `system`
        }
    };

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
    });

    afterAll(async (): Promise<void[][]> => {
        return RunningBrowser.cleanup();
    });
});
