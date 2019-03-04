import {SeleniumConfig} from "../../config/SeleniumConfig";
import {BrowserFactory} from "../../driver/lib/BrowserFactory";
import {By}             from "../../driver/lib/Locator";
import {Actor}          from "../../screenplay/Actor";
import {See}            from "../../screenplay/lib/matcher/See";
import {BrowseTheWeb}   from "../../screenplay/web/abilities/BrowseTheWeb";
import {Navigate}       from "../../screenplay/web/actions/Navigate";
import {Attribute}      from "../../screenplay/web/matcher/questions/Attribute";
import {element}        from "../../screenplay/web/SppWebElements";

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

describe('Using', () => {

    afterAll(async () => {
        await BrowserFactory.cleanup();
    });


    describe('the attribute question', () => {
        let John: Actor = Actor.named("John");

        beforeAll(async () => {
            const browser = await BrowserFactory.create(config);
            John.can(BrowseTheWeb.using(browser))
        });

        it('for retrieving the data-test-id attribute should return the attribute value ' +
            '- (test case id: 6458382e-d95d-49b6-972c-56fa68bede94)', async () => {

            const button = element(By.css("[data-test-id='button']"))
                        .called("the danger button");

            const matcher = (text: string) => {
                expect(text).toEqual("<button data-test-id=\"button\" class=\"btn btn-danger\">Danger!</button>")
            };

            await John.attemptsTo(
                Navigate.to("/"),
                See.if(Attribute.of(button).called("outerHTML")).fulfills(matcher)
            )

        });
    });
});