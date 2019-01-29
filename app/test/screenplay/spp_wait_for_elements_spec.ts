import {
    Actor,
    BrowserFactory,
    BrowseTheWeb,
    BrowserCapabilities,
    By,
    element,
    See,
    Navigate,
    Text, UntilElement, SeleniumConfig
} from "../../index";


let config: SeleniumConfig = {
    seleniumServerAddress: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost:3000",

    capabilities: {
        browserName: "chrome",
        proxy: {
            type: "direct"
        },
    }
};
import {getLogger, configure} from "log4js";
const logger = getLogger("SppWaitForElements");


describe('Waiting for SPP Elements', () => {
    let andy: Actor;

    beforeAll(async () => {
        andy = Actor.named("Andy");
        andy.whoCan(BrowseTheWeb.using(await BrowserFactory.create(config)));
    });

    afterAll(async () => {
        return BrowserFactory.cleanup()
    });


    it('should be possible with wait actions on an element - (test case id: 7fd0c550-e31c-42fd-96f8-4ceb50e6cf3b)', async () => {
        const button = element(By.css("[data-test-id='AppearButtonBy5000']"))
            .called("Test Element outside Frame")
            .shallWait(UntilElement.isVisible().forAsLongAs(20000));

        const match = (expected: string) => {
            return (actual: string) => expect(expected).toEqual(actual);
        };

        await andy.attemptsTo(
            Navigate.to(`/delayed`),
            See.if(Text.of(button)).fulfills(match("Appear in 5 Seconds")),
        );

    }, 15000);
});
