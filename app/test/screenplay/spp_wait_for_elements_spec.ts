import {
    Actor,
    BrowserFactory,
    BrowseTheWeb,
    Config,
    By,
    element,
    See,
    Navigate,
    Text, UntilElement
} from "../../index";


let config: Config = {
    browserName: "chrome",
    serverUrl: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost:3000"
};


describe('Waiting for Elements', () => {
    let andy: Actor;

    beforeAll(() => {
        andy = Actor.named("Andy");
        andy.whoCan(BrowseTheWeb.using(BrowserFactory.create(config)));
    });

    afterAll(async () => {
        await BrowserFactory.cleanup();
    });


    it('should be possible with wait actions on an element', async () => {
        const button = element(By.css(".AppearButtonBy5000"))
            .called("Test Element outside Frame")
            .shallWait(UntilElement.isVisible().forAsLongAs(6000));

        const match = (expected: string) => {
            return (actual: string) => expect(expected).toEqual(actual);
        };

        await andy.attemptsTo(
            Navigate.to(`/delayed`),
            See.if(Text.of(button)).fulfills(match("Button outside of Frame")),
        );

    }, 20000);
});
