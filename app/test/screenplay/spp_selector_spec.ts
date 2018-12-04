import {
    Actor, BrowserFactory, BrowseTheWeb, By, Config, element, Navigate, See, Text
} from "../..";

let config: Config = {
    browserName: `chrome`,
    serverUrl: `http://localhost:4444/wd/hub`,
    baseUrl: `http://localhost:3000`
};


describe('Locating an element', () => {
    let andy: Actor;

    beforeAll(() => {
        andy = Actor.named("Andy");
        andy.whoCan(BrowseTheWeb.using(BrowserFactory.create(config)));
    });

    describe('by xpath', () => {
        it('a the button name should be found', async () => {
            const button = element(By.xpath("//button[contains(text(),'Danger!')]"));
            const match = (expected: string) => (actual: string) => expect(expected).toEqual(actual);

            await andy.attemptsTo(
                Navigate.to(`/`),
                See.if(Text.of(button)).fulfills(match(`Danger!`)),
            );
        }, 100000);
    });

    afterAll(async () => {
        await BrowserFactory.cleanup();
    });
});
