import {Actor} from "../screenplay/Actor";
import {Navigate} from "../screenplay/actions/Navigate";
import {BrowseTheWeb} from "../screenplay/abilities/BrowseTheWeb";
import {BrowserFactory, Config, Key} from "..";
import {Enter} from "../screenplay/actions/Enter";
import {Wait} from "../screenplay/actions/Wait";
import {GoogleSearch} from "./PageObjects/GoogleSearch/GoogleSearch";
import {Add} from "./PageObjects/GoogleCalculator/Add";

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
    it('for calculator should show the Google calculator', async () => {
        let andy = Actor.named("Andy");
        andy.whoCan(BrowseTheWeb.using(await BrowserFactory.create(config)));

        await andy.attemptsTo(
            Navigate.to("https://www.google.de"),
            Enter.value("calculator").into(GoogleSearch.searchField),
            Enter.value(Key.ENTER).into(GoogleSearch.searchField),
            Wait.for(5000),
            Add.number(1).to(5),
            Wait.for(5000),
        );

        await BrowserFactory.cleanup();
    }, 2000000);
});