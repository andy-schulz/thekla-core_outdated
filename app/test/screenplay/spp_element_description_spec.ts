import {
    Capabilities, BrowserFactory, Actor, BrowseTheWeb, By, element, See, Navigate, Text, UntilElement, all, SppWebElementFinder
} from "../..";

let config: Capabilities = {
    browserName: "chrome",
    serverUrl: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost:3000"
};

import {getLogger, configure} from "log4js";
const logger = getLogger("SppWaitForElements");

describe('The description on an element', () => {
    let andy: Actor;

    beforeAll(() => {
        andy = Actor.named("Andy");
        andy.whoCan(BrowseTheWeb.using(BrowserFactory.create(config)));
    });

    afterAll(async () => {
        return BrowserFactory.cleanup();
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




        it('when it is attached to level one of the element chain - (test case id: 2332afe2-5d61-488c-b4e1-398b34947d82)', async () => {
            const button = element(By.css(".elementDoesNotExist"))
                .called(description);
            return checkErrorMessage(button)
        }, 20000);

        it('when it is attached to level two of the element chain - (test case id: 13f9ee79-5755-4ad0-b77a-12dc547f7200)', async () => {
            const button = element(By.css("div"))
                .element(By.css(".elementDoesNotExist"))
                .called(description);
            return checkErrorMessage(button)
        }, 20000);

        it('when it is attached to level one with two levels of an element chain - (test case id: 082e0f44-9dae-4283-adf2-05bba017fd10)', async () => {
            const button = element(By.css("div"))
                .called(description)
                .element(By.css(".elementDoesNotExist"));
            return checkErrorMessage(button)
        }, 20000);

        it('when it is attached to level one of the element list chain - (test case id: d6a644fd-cfe0-42fb-b865-0b281196cd4b)', async () => {
            const allElems = all(By.css(".doesnotexist"))
                .called(description)
                .element(By.css(".more"));
            return checkErrorMessage(allElems);
        }, 20000);

        it('when it is attached to level two of the element list chain - (test case id:a2a66832-307a-43c2-9c7e-966b95743fe3 )', async () => {
            const button = all(By.css("div"))
                .element(By.css(".elementDoesNotExist"))
                .called(description);
            return checkErrorMessage(button);
        }, 20000);

    });

    describe('on different chaning stages', () => {

        it('should be displayed in case of an error - (test case id: 51807468-c3d5-4e96-9a2e-1b89ee926ee4)', async () => {
            const description = "Test Element description in case an error is thrown";
            const button = element(By.css(".elementDoesNotExist"))
                .called(description)
                .shallWait(UntilElement.isVisible());

            return checkErrorMessage(button);
        }, 20000);
    })
});
