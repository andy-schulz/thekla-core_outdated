import {Actor}                       from "../screenplay/Actor";
import {Navigate}                    from "../screenplay/web/actions/Navigate";
import {BrowseTheWeb}                from "../screenplay/web/abilities/BrowseTheWeb";
import {BrowserFactory, Config, Key, By} from "..";
import {Enter}                       from "../screenplay/web/actions/Enter";
import {Wait}                        from "../screenplay/web/actions/Wait";
import {Count}                       from "../screenplay/web/matcher/questions/Count";
import {all}                         from "../screenplay/web/SppWebElements";
import {GoogleSearch}                from "./PageObjects/GoogleSearch/GoogleSearch";
import {Add}                         from "./PageObjects/GoogleCalculator/Add";
import {See}                         from "../screenplay/lib/matcher/See";
import {Text}                        from "../screenplay/web/matcher/questions/Text";
import {GoogleCalculator}            from "./PageObjects/GoogleCalculator/GoogleCalculator";

let config: Config = {
    browserName: "chrome",
    serverUrl: "http://localhost:4444/wd/hub",
    // firefoxOptions: {
    //     binary: "C:\\PProgramme\\FirefoxPortable\\App\\Firefox\\firefox.exe",
        // proxy: {
        //     proxyType: "direct"
        // }
    // }
};


describe('Searching on Google', () => {
    let andy: Actor;

    beforeAll(() => {
        andy = Actor.named("Andy");
        andy.whoCan(BrowseTheWeb.using(BrowserFactory.create(config)));
    });

    it('for calculator should show the Google calculator', async () => {
        let matcher: (text: string) => boolean = (test: string ) => expect(test).toEqual("6");

        await andy.attemptsTo(
            Navigate.to("https://www.google.de"),
            Enter.value("calculator").into(GoogleSearch.searchField),
            Enter.value(Key.ENTER).into(GoogleSearch.searchField),
            Wait.for(500),
            Add.number(1).to(5),
            See.if(Text.of(GoogleCalculator.input)).fulfills(matcher),
            Wait.for(500),
        );

    }, 20000);

    it('for calculator with the all method', async () => {

        const tableRows = all(By.css("tr"));
        let matcher: (count: number) => boolean = (count: number ) => expect(count).toEqual(6);
        await andy.attemptsTo(
            Navigate.to("http://localhost:3000"),
            See.if(Count.of(tableRows)).fulfills(matcher),
        );
    }, 20000);

    afterAll(() => {
        BrowserFactory.cleanup();
    })
});