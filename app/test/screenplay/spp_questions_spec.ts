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
    Attribute, SppWebElementFinder, element, Expected, Status, all, Count
} from "../../";


let seleniumConfig: SeleniumConfig = {
    seleniumServerAddress: `http://localhost:4444/wd/hub`,
    baseUrl: `http://localhost:3000`,
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

    describe(`the attribute question`, () => {
        let John: Actor = Actor.named(`John`);
        let button: SppWebElementFinder;
        const dangerButton = `<button data-test-id="button" class="btn btn-danger">Danger!</button>`;

        beforeAll((): void => {
            const browser = RunningBrowser.startedOn(seleniumConfig).withDesiredCapability(capabilities);
            John.can(BrowseTheWeb.using(browser));

            button = element(By.css(`[data-test-id='button']`))
                .called(`the danger button`);
        });

        it(`"See": it should throw an error when the repeater value is out of bounds. ` +
            `- (test case id: e0e5340d-294f-4795-ab31-08a3a71c58a4)`, async () => {
            try {
                await John.attemptsTo(
                    Navigate.to(`/`),
                    See.if(Attribute.of(button).called(`outerHTML`))
                        .is(Expected.toEqual(dangerButton))
                        .repeatFor(0,1000)
                )
            } catch (e) {
                expect(e.toString()).toContain(`The repeat value should be between 1 and 1000. But its: 0`)
            }

            try {
                await John.attemptsTo(
                    Navigate.to(`/`),
                    See.if(Attribute.of(button).called(`outerHTML`))
                        .is(Expected.toEqual(dangerButton))
                        .repeatFor(-1,1000)
                )
            } catch (e) {
                expect(e.toString()).toContain(`The repeat value should be between 1 and 1000. But its: -1`)
            }

            try {
                await John.attemptsTo(
                    Navigate.to(`/`),
                    See.if(Attribute.of(button).called(`outerHTML`))
                        .is(Expected.toEqual(dangerButton))
                        .repeatFor(1001,1000)
                )
            } catch (e) {
                expect(e.toString()).toContain(`The repeat value should be between 1 and 1000. But its: 1001`)
            }
        });

        it(`"See": it should throw an error when the interval value is out of bounds. ` +
            `- (test case id: 0676e29a-529e-474c-8413-da4c29897ab5)`, async () => {
            try {
                await John.attemptsTo(
                    Navigate.to(`/`),
                    See.if(Attribute.of(button).called(`outerHTML`))
                        .is(Expected.toEqual(dangerButton))
                        .repeatFor(2,-1)
                )
            } catch (e) {
                expect(e.toString()).toContain(`The interval value should be between 1 and 60000 ms (1 minute). But its: -1`)
            }

            try {
                await John.attemptsTo(
                    Navigate.to(`/`),
                    See.if(Attribute.of(button).called(`outerHTML`))
                        .is(Expected.toEqual(dangerButton))
                        .repeatFor(6,60001)
                )
            } catch (e) {
                expect(e.toString()).toContain(`The interval value should be between 1 and 60000 ms (1 minute). But its: 60001`)
            }
        });

        it(`for retrieving the data-test-id attribute should return the attribute value ` +
            `- (test case id: 6458382e-d95d-49b6-972c-56fa68bede94)`, async () => {
            await John.attemptsTo(
                Navigate.to(`/`),
                See.if(Attribute.of(button).called(`outerHTML`))
                    .is(Expected.toEqual(dangerButton))
            )
        });

        it(`should poll the status until the button appears ` +
            `- (test case id: 0d5c98b2-9975-4c30-a81f-5a8ef862a0aa)`, async () => {
            const delayedButton =
                    element(By.css(`[data-test-id='AppearButtonBy5000']`))
                        .called(`button which appears after 5 seconds`);

            await John.attemptsTo(
                Navigate.to(`/redirect`),
                See.if(Attribute.of(delayedButton)
                    .called(`outerHTML`))
                    .is(Expected.toEqual(`<button data-test-id="AppearButtonBy5000" class="btn btn-info">Appeared after 5 seconds</button>`))
                    .repeatFor(12,1000)
            )
        });

        it(`should poll the status and throws an error after the given tries ` +
            `- (test case id: b1afa0cd-bb66-432a-b6d3-755b422d6506)`, async () => {
            const delayedButton =
                element(By.css(`[data-test-id='AppearButtonBy5000']`))
                    .called(`button which appears after 5 seconds`);

            try {
                await John.attemptsTo(
                    Navigate.to(`/redirect`),
                    See.if(Attribute.of(delayedButton)
                        .called(`outerHTML`))
                        .is(Expected.toEqual(`<button data-test-id="AppearButtonBy5000" class="btn btn-info">Appeared after 5 seconds</button>`))
                        .repeatFor(5,1000)
                );
                expect(true).toBeFalsy(`call should have thrown an error. But it did not.`);
            } catch (e) {
                expect(e.toString()).toContain(`No Element found: 'button which appears after 5 seconds' selected by: >>byCss: [data-test-id='AppearButtonBy5000']<<`)
            }

        });


        it(`should throw an error on first try when the element is not found ` +
            `- (test case id: 29bbbf6f-4741-48fb-9c44-7ecec23d1240)`, async () => {
            const delayedButton =
                element(By.css(`[data-test-id='AppearButtonBy5000']`))
                    .called(`button which appears after 5 seconds`);

            try {
                await John.attemptsTo(
                    Navigate.to(`/redirect`),
                    See.if(Attribute.of(delayedButton)
                        .called(`outerHTML`))
                        .is(Expected.toEqual(`<button data-test-id="AppearButtonBy5000" class="btn btn-info">Appeared after 5 seconds</button>`))
                );
                expect(true).toBeFalsy(`call should have thrown an error. But it did not.`)

            } catch (e) {
                expect(e.toString()).toContain(`No Element found: 'button which appears after 5 seconds' selected by: >>byCss: [data-test-id='AppearButtonBy5000']<<`)
            }

        });
    });

    describe(`the Site question`, () => {
        const Joanna: Actor = Actor.named(`Joanna`);
        let browser: Browser;

        beforeAll((): void => {
            browser = RunningBrowser.startedOn(seleniumConfig).withDesiredCapability(capabilities);
            Joanna.can(BrowseTheWeb.using(browser))
        });

        it(`with >See<: should check for the current site url ` +
            `- (test case id: 332e9252-aec9-44b5-b936-728561523e27)`, async () => {
            await Joanna.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(TheSites.url()).is(Expected.toEqual(`http://localhost:3000/delayed`))
            )
        });

        it(`with >See<: should check for the sites title ` +
            `- (test case id: 7974c013-4234-43e4-8330-6ec788512eb8)`, async () => {
            await Joanna.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(TheSites.url()).is(Expected.toEqual(`http://localhost:3000/delayed`))
            )
        });
    });

    describe(`the Status question`, () => {
        let John: Actor = Actor.named(`John`);

        beforeAll((): void => {
            const browser = RunningBrowser.startedOn(seleniumConfig).withDesiredCapability(capabilities);
            John.can(BrowseTheWeb.using(browser));
        });

        it(`with the visibility state should be not be successful, when the button is not displayed` +
            `- (test case id: a9223ac1-37af-4198-bb3a-498192523c95)`, async () => {
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
            `- (test case id: 8e6db458-67a6-4ce6-84af-c0fcd251dc47)`, async () => {
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
            `- (test case id: 6eaa9c48-b786-467e-8f70-8196de34ea52)`, async () => {
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

    describe(`the Count question`, () => {
        let Jonathan: Actor = Actor.named(`Jonathan`);

        beforeAll((): void => {
            const browser = RunningBrowser.startedOn(seleniumConfig).withDesiredCapability(capabilities);
            Jonathan.can(BrowseTheWeb.using(browser));
        });

        it(`should return the correct number of table rows ` +
            `- (test case id: 74cbc743-7a32-428d-847e-1dc4aa8c4ddd)`, async () => {

            const tableRows = all(By.css(`tr`));

            await Jonathan.attemptsTo(
                Navigate.to(`http://localhost:3000/tables`),
                See.if(Count.of(tableRows)).is(Expected.toEqual(6)),
            );
        }, 20000);
    });

    describe(`the See oracle`, () => {
        let Jonathan: Actor = Actor.named(`Jonathan`);

        beforeAll((): void => {
            const browser = RunningBrowser.startedOn(seleniumConfig).withDesiredCapability(capabilities);
            Jonathan.can(BrowseTheWeb.using(browser));
        });

        it(`should throw an error on first try when the element is not found ` +
            `and an empty otherwise action is given` +
            `- (test case id: cd5b5dc9-a231-4f7c-9607-3f4fe0573f8d)`, async () => {
            const delayedButton =
                element(By.css(`[data-test-id='AppearButtonBy5000']`))
                    .called(`button which appears after 5 seconds`);

            try {
                await Jonathan.attemptsTo(
                    Navigate.to(`/redirect`),
                    See.if(Attribute.of(delayedButton).called(`outerHTML`))
                        .is(Expected.toEqual(`<button data-test-id="AppearButtonBy5000" class="btn btn-info">Appeared after 5 seconds</button>`))
                        .otherwise(
                            // Navigate.to("/delayed"),
                            // See.if(TheSites.url()).is(strictEqualTo("http://localhost:3000/delayed"))
                        )
                );
                expect(true).toBeFalsy(`call should have thrown an error. But it did not.`)

            } catch (e) {
                expect(e.toString()).toContain(`No Element found: 'button which appears after 5 seconds' selected by: >>byCss: [data-test-id='AppearButtonBy5000']<<`)
            }

        });


        it(`should throw an error on first try when the element is not found ` +
            `and the otherwise activities are throwing an error` +
            `- (test case id: b76d457a-5459-4479-a975-c0a9df9fb77c)`, async () => {
            const delayedButton =
                element(By.css(`[data-test-id='AppearButtonBy5000']`))
                    .called(`button which appears after 5 seconds`);

            try {
                await Jonathan.attemptsTo(
                    Navigate.to(`/redirect`),
                    See.if(Attribute.of(delayedButton).called(`outerHTML`))
                        .is(Expected.toEqual(`<button data-test-id="AppearButtonBy5000" class="btn btn-info">Appeared after 5 seconds</button>`))
                        .otherwise(
                            Navigate.to(`/delayed`),
                            See.if(TheSites.url()).is(Expected.toEqual(``))
                        )
                );

                expect(true).toBeFalsy(`should throw an error, but it didn't`);

            } catch (e) {
                expect(e.toString()).toContain(`AssertionError [ERR_ASSERTION]: 'http://localhost:3000/delayed' === ''`);
            }
        });

        it(`should not throw an error on first try when the element is not found ` +
            `and empty otherwise action is given` +
            `- (test case id: 77f977ee-d79d-4b8f-9890-a6e173659e01)`, async () => {
            const delayedButton =
                element(By.css(`[data-test-id='AppearButtonBy5000']`))
                    .called(`button which appears after 5 seconds`);

            try {
                await Jonathan.attemptsTo(
                    Navigate.to(`/redirect`),
                    See.if(Attribute.of(delayedButton).called(`outerHTML`))
                        .is(Expected.toEqual(`<button data-test-id="AppearButtonBy5000" class="btn btn-info">Appeared after 5 seconds</button>`))
                        .otherwise(
                            Navigate.to(`/delayed`),
                            See.if(TheSites.url()).is(Expected.toEqual(`http://localhost:3000/delayed`))
                        )
                );

            } catch (e) {
                expect(true).toBeFalsy(`call should not have thrown an error. But it did.`);
            }

        });

        it(`should not throw an error on first try when the element found ` +
            `and then activities are specified` +
            `- (test case id: b8d1361b-a9cc-4569-9009-ed8a71084fcd)`, async () => {
            const delayedButton =
                element(By.css(`[data-test-id='button']`))
                    .called(`the danger button`);

            try {
                await Jonathan.attemptsTo(
                    Navigate.to(`/`),
                    See.if(Attribute.of(delayedButton).called(`outerHTML`))
                        .is(Expected.toEqual(`<button data-test-id="button" class="btn btn-danger">Danger!</button>`))
                        .then(
                            Navigate.to(`/redirect`),
                            See.if(TheSites.url()).is(Expected.toEqual(`http://localhost:3000/redirect`))
                        )
                );

            } catch (e) {
                console.error(e.toString());
                expect(true).toBeFalsy(`should not throw an error, but it did`);
            }
        });

        it(`should throw an error on first try when the element found ` +
            `and an error is present in the then activities` +
            `- (test case id: c8141330-3c00-43e2-828b-e574ccc366c2)`, async () => {
            const delayedButton =
                element(By.css(`[data-test-id='button']`))
                    .called(`the danger button`);

            try {
                await Jonathan.attemptsTo(
                    Navigate.to(`/`),
                    See.if(Attribute.of(delayedButton).called(`outerHTML`))
                        .is(Expected.toEqual(`<button data-test-id="button" class="btn btn-danger">Danger!</button>`))
                        .then(
                            Navigate.to(`/redirect`),
                            See.if(TheSites.url()).is(Expected.toEqual(`http://localhost:3000/delayed`))
                        )
                );
                expect(true).toBeFalsy(`should throw an error, but it didn't`);

            } catch (e) {
                expect(e.toString()).toContain(`AssertionError [ERR_ASSERTION]: 'http://localhost:3000/redirect' === 'http://localhost:3000/delayed'`);
            }
        });



    });
});