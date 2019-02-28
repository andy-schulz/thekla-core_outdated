import {
    Actor,
    BrowseTheWeb,
    BrowserFactory,
    Enter,
    Navigate,
    See,
    Key,
    all,
    By,
    Count,
    Text,
    SeleniumConfig,
    Sleep
}                         from "../..";
import {GoogleSearch}     from "../PageObjects/GoogleSearch/GoogleSearch";
import {Add}              from "../PageObjects/GoogleCalculator/Add";
import {GoogleCalculator} from "../PageObjects/GoogleCalculator/GoogleCalculator";

let config: SeleniumConfig = {
    seleniumServerAddress: "http://localhost:4444/wd/hub",

    capabilities: {
        browserName: "chrome",

    }
    // firefoxOptions: {
    //     binary: "C:\\PProgramme\\FirefoxPortable\\App\\Firefox\\firefox.exe",
        // proxy: {
        //     proxyType: "direct"
        // }
    // }
};
import {getLogger, configure} from "log4js";
const logger = getLogger("Actor");

describe('Searching on Google', () => {
    let john: Actor;

    beforeAll(async () => {
        john = Actor.named("Andy");
        john.whoCan(BrowseTheWeb.using(await BrowserFactory.create(config)));
    });

    it('for calculator should show the Google calculator - (test case id: 1761a239-3e50-408a-8e5e-1e4e6e6f07c2)', async () => {

        const  match = (text: string) => {
            return (test: string) => expect(test).toEqual(text);
        };


        await john.attemptsTo(
            Navigate.to("https://www.google.de"),
            Enter.value("calculator").into(GoogleSearch.searchField),
            Enter.value(Key.ENTER).into(GoogleSearch.searchField),
            Sleep.for(500),
            Add.number(1).to(5),
            See.if(Text.of(GoogleCalculator.input)).fulfills(match("6")),
            Sleep.for(500),
        );

    }, 20000);

    it('for calculator should show the Google calculator - (test case id: ad1aa18b-4e81-4e53-86e8-5397927f666e)', async () => {
        const  match = (text: string) => {
            return (test: string) => expect(test).toEqual(text);
        };
        await john.attemptsTo(
            Navigate.to("https://www.google.de"),
            Enter.value("calculator").into(GoogleSearch.searchField),
            Enter.value(Key.ENTER).into(GoogleSearch.searchField),
            Sleep.for(500),
            Add.number(1).to(5),
            See.if(Text.of(GoogleCalculator.inputNumber)).fulfills(match("6")),
            Sleep.for(500),
        );

    }, 20000);

    it('for calculator with the all method - (test case id: 74cbc743-7a32-428d-847e-1dc4aa8c4ddd)', async () => {

        const tableRows = all(By.css("tr"));
        let matcher: (count: number) => boolean = (count: number ) => expect(count).toEqual(6);
        await john.attemptsTo(
            Navigate.to("http://localhost:3000/tables"),
            See.if(Count.of(tableRows)).fulfills(matcher),
        );
    }, 20000);

    afterAll(() => {
        return  BrowserFactory.cleanup();
    })
});