import {
    DesiredCapabilities,
    SeleniumConfig,
    Browser,
    RunningBrowser,
    Actor,
    BrowseTheWeb,
    By,
    Navigate,
    See,
    TheSites,
    Attribute, SppWebElementFinder, element, Expected, Status, all, Count, ReturnTaskValue, ReturnedResult,
}                      from "../../../index";
import {UsesAbilities} from "../../../screenplay/Actor";
import {Question}      from "../../../screenplay/lib/questions/Question";


let seleniumConfig: SeleniumConfig = {
    seleniumServerAddress: `http://localhost:4444/wd/hub`,
    baseUrl: `https://teststepsframeworktester.azurewebsites.net`,
};
const capabilities: DesiredCapabilities ={
    browserName: `chrome`,
    proxy: {
        type: `direct`
    }
};
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;


describe(`Using`, (): void => {

    afterAll(async (): Promise<void[][]> => {
        return RunningBrowser.cleanup();
    });


    describe(`the Site question`, (): void => {
        const Joanna: Actor = Actor.named(`Joanna`);
        let browser: Browser;

        beforeAll((): void => {
            browser = RunningBrowser.startedOn(seleniumConfig).withDesiredCapability(capabilities);
            Joanna.can(BrowseTheWeb.using(browser))
        });

        it(`with >See<: should check for the current site url ` +
            `- (test case id: 332e9252-aec9-44b5-b936-728561523e27)`, async (): Promise<void> => {
            await Joanna.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(TheSites.url()).is(Expected.toEqual(`https://teststepsframeworktester.azurewebsites.net/delayed`))
            )
        });

        it(`with >See<: should check for the sites title ` +
            `- (test case id: 7974c013-4234-43e4-8330-6ec788512eb8)`, async (): Promise<void> => {
            await Joanna.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(TheSites.url()).is(Expected.toEqual(`https://teststepsframeworktester.azurewebsites.net/delayed`))
            )
        });
    });

    describe(`the Status question`, (): void => {
        let John: Actor = Actor.named(`John`);

        beforeAll((): void => {
            const browser = RunningBrowser.startedOn(seleniumConfig).withDesiredCapability(capabilities);
            John.can(BrowseTheWeb.using(browser));
        });

        it(`with the visibility state should be not be successful, when the button is not displayed` +
            `- (test case id: a9223ac1-37af-4198-bb3a-498192523c95)`, async (): Promise<void> => {
            const delayedButton =
                element(By.css(`[data-test-id='AppearButtonBy5000']`))
                    .called(`button which appears after 5 seconds`);

            await John.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(Status.visible.of(delayedButton))
                    .is(Expected.toBe(false))
            )
        });

        it(`with the visibility state should be not be successful, when the button is not displayed` +
            `- (test case id: 8e6db458-67a6-4ce6-84af-c0fcd251dc47)`, async (): Promise<void> => {
            const delayedButton =
                element(By.css(`[data-test-id='DisappearButtonBy10000']`))
                    .called(`button which appears after 5 seconds`);

            await John.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(Status.visible.of(delayedButton))
                    .is(Expected.toBe(true))
            )
        });

        it(`with the visibility state should be successful, when the button is displayed after 5 Seconds` +
            `- (test case id: 6eaa9c48-b786-467e-8f70-8196de34ea52)`, async (): Promise<void> => {
            const delayedButton =
                element(By.css(`[data-test-id='DisappearButtonBy5000']`))
                    .called(`button which appears after 5 seconds`);

            await John.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(Status.visible.of(delayedButton))
                    .is(Expected.toBe(false))
                    .repeatFor(6, 1000)
            )
        });
    });

    describe(`the Count question`, (): void => {
        let Jonathan: Actor = Actor.named(`Jonathan`);

        beforeAll((): void => {
            const browser = RunningBrowser.startedOn(seleniumConfig).withDesiredCapability(capabilities);
            Jonathan.can(BrowseTheWeb.using(browser));
        });

        it(`should return the correct number of table rows ` +
            `- (test case id: 74cbc743-7a32-428d-847e-1dc4aa8c4ddd)`, async (): Promise<void> => {

            const tableRows = all(By.css(`tr`));

            await Jonathan.attemptsTo(
                Navigate.to(`https://teststepsframeworktester.azurewebsites.net/tables`),
                See.if(Count.of(tableRows)).is(Expected.toEqual(6)),
            );
        },
        20000);
    });
});