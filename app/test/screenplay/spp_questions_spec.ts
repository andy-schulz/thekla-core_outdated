import {SeleniumConfig}               from "../../config/SeleniumConfig";
import {BrowserFactory}               from "../../driver/lib/BrowserFactory";
import {By}                           from "../../driver/lib/Locator";
import {Actor}                        from "../../screenplay/Actor";
import {See}                          from "../../screenplay/lib/matcher/See";
import {BrowseTheWeb}                 from "../../screenplay/web/abilities/BrowseTheWeb";
import {Navigate}                     from "../../screenplay/web/actions/Navigate";
import {Attribute}                    from "../../screenplay/web/matcher/questions/Attribute";
import {element, SppWebElementFinder} from "../../screenplay/web/SppWebElements";
import {strictEqual} from "assert";


let config: SeleniumConfig = {
    seleniumServerAddress: `http://localhost:4444/wd/hub`,
    baseUrl: `http://localhost:3000`,

    capabilities: {
        browserName: `chrome`,
        proxy: {
            type: "direct"
        }
    }
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Using', () => {

    afterAll(async () => {
        await BrowserFactory.cleanup();
    });


    describe('the attribute question', () => {
        let John: Actor = Actor.named("John");
        let button: SppWebElementFinder;
        let matcher: (text: string) => boolean;

        beforeAll(async () => {
            const browser = await BrowserFactory.create(config);
            John.can(BrowseTheWeb.using(browser));

            button = element(By.css("[data-test-id='button']"))
                .called("the danger button");

            matcher = (text: string): boolean => {
                expect(text).toEqual("<button data-test-id=\"button\" class=\"btn btn-danger\">Danger!</button>");
                // can return true
                return true;
            };
        });

        it('"See": it should throw an error when the repeater value is out of bounds. ' +
            '- (test case id: e0e5340d-294f-4795-ab31-08a3a71c58a4)', async () => {
            try {
                await John.attemptsTo(
                    Navigate.to("/"),
                    See.if(Attribute.of(button).called("outerHTML"))
                        .fulfills(matcher)
                        .repeatFor(0,1000)
                )
            } catch (e) {
                expect(e.toString()).toContain("The repeat value should be between 1 and 1000. But its: 0")
            }

            try {
                await John.attemptsTo(
                    Navigate.to("/"),
                    See.if(Attribute.of(button).called("outerHTML"))
                        .fulfills(matcher)
                        .repeatFor(-1,1000)
                )
            } catch (e) {
                expect(e.toString()).toContain("The repeat value should be between 1 and 1000. But its: -1")
            }

            try {
                await John.attemptsTo(
                    Navigate.to("/"),
                    See.if(Attribute.of(button).called("outerHTML"))
                        .fulfills(matcher)
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
                        .fulfills(matcher)
                        .repeatFor(2,-1)
                )
            } catch (e) {
                expect(e.toString()).toContain("The interval value should be between 1 and 60000 ms (1 minute). But its: -1")
            }

            try {
                await John.attemptsTo(
                    Navigate.to("/"),
                    See.if(Attribute.of(button).called("outerHTML"))
                        .fulfills(matcher)
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
                See.if(Attribute.of(button).called("outerHTML")).fulfills(matcher)
            )
        });

        it('should poll the status until the button appears ' +
            '- (test case id: 0d5c98b2-9975-4c30-a81f-5a8ef862a0aa)', async () => {
            const delayedButton =
                    element(By.css("[data-test-id='AppearButtonBy5000']"))
                        .called("button which appears after 5 seconds");

            const matcher = (text: string): boolean => {
                strictEqual(text,"<button data-test-id=\"AppearButtonBy5000\" class=\"btn btn-info\">Appeared after 5 seconds</button>");
                return true;
            };

            await John.attemptsTo(
                Navigate.to("/redirect"),
                See.if(Attribute.of(delayedButton)
                    .called("outerHTML"))
                    .fulfills(matcher)
                    .repeatFor(12,1000)
            )
        });

        it('should poll the status and throws an error after the given tries ' +
            '- (test case id: b1afa0cd-bb66-432a-b6d3-755b422d6506)', async () => {
            const delayedButton =
                element(By.css("[data-test-id='AppearButtonBy5000']"))
                    .called("button which appears after 5 seconds");

            const matcher = (text: string): boolean => {
                strictEqual(text,"<button data-test-id=\"AppearButtonBy5000\" class=\"btn btn-info\">Appeared after 5 seconds</button>");
                return true;
            };

            try {
                await John.attemptsTo(
                    Navigate.to("/redirect"),
                    See.if(Attribute.of(delayedButton)
                        .called("outerHTML"))
                        .fulfills(matcher)
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

            const matcher = (text: string): boolean => {
                return expect(text).toEqual("<button data-test-id=\"AppearButtonBy5000\" class=\"btn btn-info\">Appeared after 5 seconds</button>");
            };

            try {
                await John.attemptsTo(
                    Navigate.to("/redirect"),
                    See.if(Attribute.of(delayedButton)
                        .called("outerHTML"))
                        .fulfills(matcher)
                );
                expect(true).toBeFalsy("call should have thrown an error. But it did not.")

            } catch (e) {
                expect(e.toString()).toContain("No Element found: 'button which appears after 5 seconds' selected by: >>byCss: [data-test-id='AppearButtonBy5000']<<")
            }

        });
    });
});