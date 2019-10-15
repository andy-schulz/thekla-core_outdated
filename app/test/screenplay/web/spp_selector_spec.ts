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
    UntilElement, Expected, Browser
}                                                                        from "../../../index";
import {checkForFireFoxCyclicError}                                      from "../../0_helper/browser_bugs";
import {setBrowserStackName, standardCapabilities, standardServerConfig} from "../../0_helper/config";
import {cloneDeep}                                                       from "lodash";
import {configure, getLogger}                                            from "log4js";

configure(`res/config/log4js.json`);

describe(`When locating an element,`, (): void => {
    const logger = getLogger(`spp_selector_spec`);

    const config: ServerConfig = cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = cloneDeep(standardCapabilities);
    setBrowserStackName(capabilities, `spp_selector_spec.ts`);

    let aBrowser: Browser;
    let john: Actor;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        john = Actor.named(`John`);
        aBrowser = RunningBrowser.startedOn(config).withCapabilities(capabilities);
        john.whoCan(BrowseTheWeb.using(aBrowser));
    });

    describe(`by xpath`, (): void => {

        it(`the button name should be found 
        - (test case id: 914ccdea-ff5f-446e-a7de-509bd1c5d30f)`, (): Promise<void> => {
            const button = element(By.xpath(`//button[contains(text(),'Danger!')]`))
                .shallWait(UntilElement.is.visible());

            return john.attemptsTo(
                Navigate.to(`/`),
                See.if(Text.of(button)).is(Expected.toEqual(`Danger!`)),
                Click.on(button),
            );
        });

        it(`the button name should be found 
        - (test case id: 9a383bbf-9db9-41c5-b903-7f8d61bea88a)`, async (): Promise<void | {}> => {

            const button = element(By.cssContainingText(`button`, `Danger!`))
                .shallWait(UntilElement.is.visible());

            await john.attemptsTo(
                Navigate.to(`/`),
            );

            // check for firefox problem
            const error = new Error(`TypeError: cyclic object value`);
            error.name = `javascript error`;
            return checkForFireFoxCyclicError(
                aBrowser.capabilities.browserName,
                aBrowser.capabilities.browserVersion, error,
                logger,
                `9a383bbf-9db9-41c5-b903-7f8d61bea88a`)
                .catch(() => {
                    return john.attemptsTo(
                        See.if(Text.of(button)).is(Expected.toEqual(`Danger!`)),
                        Click.on(button)
                    )
                });

        });
    });

    afterAll(async (): Promise<void[]> => {
        return RunningBrowser.cleanup();
    });
});
