import {
    Config, BrowserFactory, Actor, BrowseTheWeb, By, element, See, Navigate, Text, UntilElement, all, SppWebElementFinder
} from "../..";
import {configure} from "log4js";

configure("config/log4js.json");

let config: Config = {
    browserName: "chrome",
    serverUrl: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost:3000"
};


describe('The description on an element', () => {
    let andy: Actor;

    beforeAll(() => {
        andy = Actor.named("Andy");
        andy.whoCan(BrowseTheWeb.using(BrowserFactory.create(config)));
    });

    afterAll(async () => {
        await BrowserFactory.cleanup();
    });

    const description = "Test Element description in case an error is thrown";
    const match = (expected: string) => {
        return (actual: string) => expect(actual).toEqual(expected);
    };
    const greaterThan = (expected: number) => {
        return (actual: number) => expect(actual).toBeGreaterThanOrEqual(expected);
    };

    const checkErrorMessage = async (elem: SppWebElementFinder) => {
        const callback = {catchfn: (e: any) => match(description)};
        spyOn(callback, "catchfn").and.callThrough();

        await andy.attemptsTo(
            Navigate.to(`/`),
            See.if(Text.of(elem)).fulfills(match("There is no element to test")),
        ).catch(callback.catchfn);

        expect(callback.catchfn).toHaveBeenCalled();
        expect(callback.catchfn).toHaveBeenCalledTimes(1);
    };

    describe('should be thrown in case of an error', () => {




        it('when it is attached to level one of the element chain', async () => {
            const button = element(By.css(".elementDoesNotExist"))
                .called(description);
            return checkErrorMessage(button)
        }, 20000);

        it('when it is attached to level two of the element chain', async () => {
            const button = element(By.css("div"))
                .element(By.css(".elementDoesNotExist"))
                .called(description);
            return checkErrorMessage(button)
        }, 20000);

        it('when it is attached to level one with two levels of an element chain', async () => {
            const button = element(By.css("div"))
                .called(description)
                .element(By.css(".elementDoesNotExist"));
            return checkErrorMessage(button)
        }, 20000);

        it('when it is attached to level one of the element list chain', async () => {
            const allElems = all(By.css(".doesnotexist"))
                .called(description)
                .element(By.css(".more"));
            return checkErrorMessage(allElems);
        }, 20000);

        it('when it is attached to level two of the element list chain', async () => {
            const button = all(By.css("div"))
                .element(By.css(".elementDoesNotExist"))
                .called(description);
            return checkErrorMessage(button);
        }, 20000);

    });

    describe('on different chaning stages', () => {

        it('should be displayed in case of an error', async () => {
            const description = "Test Element description in case an error is thrown";
            const button = element(By.css(".elementDoesNotExist"))
                .called(description)
                .shallWait(UntilElement.isVisible());

            return checkErrorMessage(button);
        }, 20000);
    })
});
