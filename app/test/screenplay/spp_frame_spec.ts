import {Config}         from "../../driver/interface/Config";
import {BrowserFactory} from "../../driver/lib/BrowserFactory";
import {UntilElement}   from "../../driver/lib/ElementConditions";
import {Key}            from "../../driver/lib/Key";
import {By}             from "../../driver/lib/Locator";
import {Actor}          from "../../screenplay/Actor";
import {See}            from "../../screenplay/lib/matcher/See";
import {BrowseTheWeb}   from "../../screenplay/web/abilities/BrowseTheWeb";
import {Enter}          from "../../screenplay/web/actions/Enter";
import {Navigate}       from "../../screenplay/web/actions/Navigate";
import {Wait}           from "../../screenplay/web/actions/Wait";
import {Text}             from "../../screenplay/web/matcher/questions/Text";
import {element, frame}   from "../../screenplay/web/SppWebElements";
import {Add}              from "../PageObjects/GoogleCalculator/Add";
import {GoogleCalculator} from "../PageObjects/GoogleCalculator/GoogleCalculator";
import {GoogleSearch}     from "../PageObjects/GoogleSearch/GoogleSearch";

let config: Config = {
    browserName: "chrome",
    serverUrl: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost:3000"
};


describe('Searching on Google', () => {
    let andy: Actor;

    beforeAll(() => {
        andy = Actor.named("Andy");
        andy.whoCan(BrowseTheWeb.using(BrowserFactory.create(config)));
    });

    afterAll(async () => {
        await BrowserFactory.cleanup();
    });

    it('for calculator should show the Google calculator', async () => {
        const button = element(By.css(".buttonoutsideframes button"));

        const frame1 = frame(By.css(".button-in-single-frame"));
        const button1 = frame1.element(By.css(".btn-secondary"));

        const frame21 = frame(By.css(".button-in-two-frames"));
        const frame22 = frame21.frame(By.css(".button-in-single-frame"));
        const button2 = frame22.element(By.css(".btn-secondary"));



        const match = (expected: string) => {
            return (actual: string) => expect(expected).toEqual(actual);
        };

        await andy.attemptsTo(
            Navigate.to(`/nestedFrames`),
            See.if(Text.of(button)).fulfills(match("Button outside of Frame")),
            See.if(Text.of(button1)).fulfills(match("Button inside single frame")),
            See.if(Text.of(button)).fulfills(match("Button outside of Frame")),
            See.if(Text.of(button2)).fulfills(match("Button nested inside frame of frame")),
            See.if(Text.of(button)).fulfills(match("Button outside of Frame")),
        );

    }, 20000);


    it('for calculator should show the Google calculator', async () => {
        const button = element(By.css(".buttonoutsideframes button"));

        const frame1 = frame(By.css(".button-in-single-frame"))
            .shallWait(UntilElement.isVisible().forAsLongAs(5000));
        const button1 = frame1.element(By.css(".btn-secondary"));

        const frame21 = frame(By.css(".button-in-two-frames"))
            .shallWait(UntilElement.isVisible().forAsLongAs(5000));
        const frame22 = frame21.frame(By.css(".button-in-single-frame"))
            .shallWait(UntilElement.isVisible().forAsLongAs(5000));
        const button2 = frame22.element(By.css(".btn-secondary"));



        const match = (expected: string) => {
            return (actual: string) => expect(expected).toEqual(actual);
        };

        await andy.attemptsTo(
            Navigate.to(`/nestedFrames`),
            See.if(Text.of(button)).fulfills(match("Button outside of Frame")),
            See.if(Text.of(button1)).fulfills(match("Button inside single frame")),
            See.if(Text.of(button)).fulfills(match("Button outside of Frame")),
            See.if(Text.of(button2)).fulfills(match("Button nested inside frame of frame")),
            See.if(Text.of(button)).fulfills(match("Button outside of Frame")),
        );

    }, 20000);
});
