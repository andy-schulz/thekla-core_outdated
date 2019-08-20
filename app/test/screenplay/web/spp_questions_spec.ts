import {LogLevel} from "../../../config/ServerConfig";
import {
    DesiredCapabilities,
    ServerConfig,
    Browser,
    RunningBrowser,
    Actor,
    BrowseTheWeb,
    By,
    Navigate,
    See,
    TheSites,
    Attribute, element, Expected, Status, all, Count, Extract, Text, Click
}                 from "../../../index";

import {configure} from "log4js";
configure(`res/config/log4js.json`);





describe(`Using`, (): void => {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    let seleniumConfig: ServerConfig = {
        automationFramework: {
            type: process.env.FRAMEWORK === `wdio` ? `wdio` : `wdjs`,
            logLevel: (process.env.LOGLEVEL ? process.env.LOGLEVEL : `warn`) as LogLevel
        },
        serverAddress: {
            hostname: `localhost`,
        },
        baseUrl: process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`
    };
    const capabilities: DesiredCapabilities ={
        browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
        proxy: {
            type: `system`
        }
    };

    const testUrl = process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`


    afterAll(async (): Promise<void[][]> => {
        return RunningBrowser.cleanup();
    });


    describe(`the Site question`, (): void => {
        const Joanna: Actor = Actor.named(`Joanna`);
        let browser: Browser;

        beforeAll((): void => {
            browser = RunningBrowser.startedOn(seleniumConfig).withCapabilities(capabilities);
            Joanna.can(BrowseTheWeb.using(browser))
        });

        it(`with >See<: should check for the current site url ` +
            `- (test case id: 332e9252-aec9-44b5-b936-728561523e27)`, async (): Promise<void> => {
            await Joanna.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(TheSites.url()).is(Expected.toEqual(`${testUrl}/delayed`))
            )
        });

        it(`with >See<: should check for the sites title ` +
            `- (test case id: 7974c013-4234-43e4-8330-6ec788512eb8)`, async (): Promise<void> => {
            await Joanna.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(TheSites.url()).is(Expected.toEqual(`${testUrl}/delayed`))
            )
        });
    });

    describe(`the Status question`, (): void => {
        let John: Actor = Actor.named(`John`);

        beforeAll((): void => {
            const browser = RunningBrowser.startedOn(seleniumConfig).withCapabilities(capabilities);
            John.can(BrowseTheWeb.using(browser));
        });

        it(`with the visibility state should be not be successful, when the button is not displayed` +
            `- (test case id: a9223ac1-37af-4198-bb3a-498192523c95)`, async (): Promise<void> => {
            const delayedButton =
                element(By.css(`[data-test-id='AppearButtonBy4000']`))
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
                element(By.css(`[data-test-id='DisappearButtonBy8000']`))
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
                element(By.css(`[data-test-id='DisappearButtonBy4000']`))
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
            const browser = RunningBrowser.startedOn(seleniumConfig).withCapabilities(capabilities);
            Jonathan.can(BrowseTheWeb.using(browser));
        });

        it(`should return the correct number of table rows ` +
            `- (test case id: 74cbc743-7a32-428d-847e-1dc4aa8c4ddd)`, async (): Promise<void> => {

            const tableRows = all(By.css(`tr`));

            await Jonathan.attemptsTo(
                Navigate.to(`/tables`),
                See.if(Count.of(tableRows)).is(Expected.toEqual(107)),
            );
        },
        20000);
    });

    describe(`the Attribute question`, (): void => {
        let Jonathan: Actor = Actor.named(`Jonathan`);


        beforeAll((): void => {
            const browser = RunningBrowser.startedOn(seleniumConfig).withCapabilities(capabilities);
            Jonathan.can(BrowseTheWeb.using(browser));
        });

        it(`on the elements attribute should return the calculated value 
        - (test case id: b9b77405-54c1-48dc-8e2e-036d9382f192)`, async (): Promise<void> => {

            const elementWithCalculatedValueAttribute = element(By.css(`[data-test-id='elementAttribute']`));
            const divWithText = element(By.css(`[data-test-id='innerHtmlTextOfDiv']`));
            const setElementsValueButton = element(By.css(`[data-test-id='setElementsValueButton']`));

            const arr: string[] = [];
            const saveTo = (text: string): void => {
                arr.push(text);
            };

            await Jonathan.attemptsTo(
                Navigate.to(`/`),
                Click.on(setElementsValueButton),
                Extract.the(Text.of(divWithText)).by(saveTo),
                See.if(Attribute
                    .of(elementWithCalculatedValueAttribute)
                    .called(`value`)
                )
                    .is((actual: string): boolean => {
                        expect(actual).toEqual(arr[0]);
                        return true;
                    })
            );
        });

        it(`on the tags attribute should return the tags value 
        - (test case id: b9b77405-54c1-48dc-8e2e-036d9382f192)`, async (): Promise<void> => {

            const elementHtmlAttribute = element(By.css(`[data-test-id='htmlAttribute']`));
            const divWithText = element(By.css(`[data-test-id='innerHtmlTextOfDiv']`));
            const setElementsValueButton = element(By.css(`[data-test-id='setElementsValueButton']`));

            const arr: string[] = [];
            const saveTo = (text: string): void => {
                arr.push(text);
            };

            await Jonathan.attemptsTo(
                Navigate.to(`/`),
                Click.on(setElementsValueButton),
                Extract.the(Text.of(divWithText)).by(saveTo),
                See.if(Attribute.of(elementHtmlAttribute).called(`value`))
                    .is((actual: string): boolean => {
                        expect(actual).toEqual(arr[0], `expected tag attribute was not found`);
                        return true;
                    }),
            );
        });
    });
});