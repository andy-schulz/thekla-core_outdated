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
    Attribute, SppWebElementFinder, element, strictEqualTo
} from "../../";


let seleniumConfig: SeleniumConfig = {
    seleniumServerAddress: `http://localhost:4444/wd/hub`,
    baseUrl: `http://localhost:3000`,
};
const capabilities: DesiredCapabilities ={
    browserName: `chrome`,
    proxy: {
        type: "direct"
    }
};
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Using', () => {

    afterAll(async () => {
        await RunningBrowser.cleanup();
    });

    describe('the attribute question', () => {
        let John: Actor = Actor.named("John");
        let button: SppWebElementFinder;
        let matcher: (text: string) => boolean;
        const dangerButton: string = "<button data-test-id=\"button\" class=\"btn btn-danger\">Danger!</button>";

        beforeAll(async () => {
            const browser = await RunningBrowser.startedOn(seleniumConfig).withDesiredCapability(capabilities);
            John.can(BrowseTheWeb.using(browser));

            button = element(By.css("[data-test-id='button']"))
                .called("the danger button");
        });

        it('"See": it should throw an error when the repeater value is out of bounds. ' +
            '- (test case id: e0e5340d-294f-4795-ab31-08a3a71c58a4)', async () => {
            try {
                await John.attemptsTo(
                    Navigate.to("/"),
                    See.if(Attribute.of(button).called("outerHTML"))
                        .is(strictEqualTo(dangerButton))
                        .repeatFor(0,1000)
                )
            } catch (e) {
                expect(e.toString()).toContain("The repeat value should be between 1 and 1000. But its: 0")
            }

            try {
                await John.attemptsTo(
                    Navigate.to("/"),
                    See.if(Attribute.of(button).called("outerHTML"))
                        .is(strictEqualTo(dangerButton))
                        .repeatFor(-1,1000)
                )
            } catch (e) {
                expect(e.toString()).toContain("The repeat value should be between 1 and 1000. But its: -1")
            }

            try {
                await John.attemptsTo(
                    Navigate.to("/"),
                    See.if(Attribute.of(button).called("outerHTML"))
                        .is(strictEqualTo(dangerButton))
                        .repeatFor(1001,1000)
                )
            } catch (e) {
                expect(e.toString()).toContain("The repeat value should be between 1 and 1000. But its: 1001")
            }
        });

        it('"See": it should throw an error when the interval value is out of bounds. ' +
            '- (test case id: 0676e29a-529e-474c-8413-da4c29897ab5)', async () => {
            try {
                await John.attemptsTo(
                    Navigate.to("/"),
                    See.if(Attribute.of(button).called("outerHTML"))
                        .is(strictEqualTo(dangerButton))
                        .repeatFor(2,-1)
                )
            } catch (e) {
                expect(e.toString()).toContain("The interval value should be between 1 and 60000 ms (1 minute). But its: -1")
            }

            try {
                await John.attemptsTo(
                    Navigate.to("/"),
                    See.if(Attribute.of(button).called("outerHTML"))
                        .is(strictEqualTo(dangerButton))
                        .repeatFor(6,60001)
                )
            } catch (e) {
                expect(e.toString()).toContain("The interval value should be between 1 and 60000 ms (1 minute). But its: 60001")
            }
        });

        it('for retrieving the data-test-id attribute should return the attribute value ' +
            '- (test case id: 6458382e-d95d-49b6-972c-56fa68bede94)', async () => {
            await John.attemptsTo(
                Navigate.to("/"),
                See.if(Attribute.of(button).called("outerHTML")).is(strictEqualTo(dangerButton))
            )
        });

        it('should poll the status until the button appears ' +
            '- (test case id: 0d5c98b2-9975-4c30-a81f-5a8ef862a0aa)', async () => {
            const delayedButton =
                    element(By.css("[data-test-id='AppearButtonBy5000']"))
                        .called("button which appears after 5 seconds");

            await John.attemptsTo(
                Navigate.to("/redirect"),
                See.if(Attribute.of(delayedButton)
                    .called("outerHTML"))
                    .is(strictEqualTo("<button data-test-id=\"AppearButtonBy5000\" class=\"btn btn-info\">Appeared after 5 seconds</button>"))
                    .repeatFor(12,1000)
            )
        });

        it('should poll the status and throws an error after the given tries ' +
            '- (test case id: b1afa0cd-bb66-432a-b6d3-755b422d6506)', async () => {
            const delayedButton =
                element(By.css("[data-test-id='AppearButtonBy5000']"))
                    .called("button which appears after 5 seconds");

            try {
                await John.attemptsTo(
                    Navigate.to("/redirect"),
                    See.if(Attribute.of(delayedButton)
                        .called("outerHTML"))
                        .is(strictEqualTo("<button data-test-id=\"AppearButtonBy5000\" class=\"btn btn-info\">Appeared after 5 seconds</button>"))
                        .repeatFor(5,1000)
                );
                expect(true).toBeFalsy("call should have thrown an error. But it did not.");
            } catch (e) {
                expect(e.toString()).toContain("No Element found: 'button which appears after 5 seconds' selected by: >>byCss: [data-test-id='AppearButtonBy5000']<<")
            }

        });


        it('should throw an error on first try when the element is not found ' +
            '- (test case id: 29bbbf6f-4741-48fb-9c44-7ecec23d1240)', async () => {
            const delayedButton =
                element(By.css("[data-test-id='AppearButtonBy5000']"))
                    .called("button which appears after 5 seconds");

            try {
                await John.attemptsTo(
                    Navigate.to("/redirect"),
                    See.if(Attribute.of(delayedButton)
                        .called("outerHTML"))
                        .is(strictEqualTo("<button data-test-id=\"AppearButtonBy5000\" class=\"btn btn-info\">Appeared after 5 seconds</button>"))
                );
                expect(true).toBeFalsy("call should have thrown an error. But it did not.")

            } catch (e) {
                expect(e.toString()).toContain("No Element found: 'button which appears after 5 seconds' selected by: >>byCss: [data-test-id='AppearButtonBy5000']<<")
            }

        });
    });

    describe('the Site question', () => {
        const Joanna: Actor = Actor.named("John");
        let browser: Browser;

        beforeAll(async () => {
            browser = await RunningBrowser.startedOn(seleniumConfig).withDesiredCapability(capabilities);
            Joanna.can(BrowseTheWeb.using(browser))
        });

        it('with >See<: should check for the current site url ' +
            '- (test case id: 332e9252-aec9-44b5-b936-728561523e27)', () => {
            Joanna.attemptsTo(
                Navigate.to("/delayed"),
                See.if(TheSites.url()).is(strictEqualTo("http://localhost/delayed"))
            )
        });

        it('with >See<: should check for the sites title ' +
            '- (test case id: 7974c013-4234-43e4-8330-6ec788512eb8)', () => {
            Joanna.attemptsTo(
                Navigate.to("/delayed"),
                See.if(TheSites.title()).is(strictEqualTo("http://localhost/delayed"))
            )
        });
    });
});