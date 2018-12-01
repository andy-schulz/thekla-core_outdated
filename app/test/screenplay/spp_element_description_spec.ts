import {
    Config,
    BrowserFactory,
    Actor,
    BrowseTheWeb,
    By,
    element,
    See,
    Navigate,
    Text
} from "../..";


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


    fit('should be possible with wait actions on each frame', async () => {
        const button = element(By.css(".AppearButtonBy5000"))
            .called("Test Element outside Frame");

        const match = (expected: string) => {
            return (actual: string) => expect(expected).toEqual(actual);
        };

        await andy.attemptsTo(
            Navigate.to(`/nestedFrames`),
            See.if(Text.of(button)).fulfills(match("Button outside of Frame")),
        );

    }, 20000);
});
