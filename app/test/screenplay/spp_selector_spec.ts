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
        it('a the button name should be found - (test case id: 9a383bbf-9db9-41c5-b903-7f8d61bea88a)', async () => {
            const button = element(By.xpath("//button[contains(text(),'Danger!')]"));
            const match = (expected: string) => (actual: string) => expect(expected).toEqual(actual);

            await andy.attemptsTo(
                Navigate.to(`/`),
                See.if(Text.of(button)).fulfills(match(`Danger!`)),
            );
        }, 100000);
    });

    afterAll(async () => {
        return BrowserFactory.cleanup();
    });
});
