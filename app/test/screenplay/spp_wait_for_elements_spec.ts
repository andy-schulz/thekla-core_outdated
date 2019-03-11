import {
    Actor,
    BrowserFactory,
    BrowseTheWeb,
    By,
    element,
    See,
    Navigate,
    Text, UntilElement, SeleniumConfig, Click, Wait
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
    let walterTheWaiter: Actor;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    beforeAll(async () => {
        walterTheWaiter = Actor.named("Andy");
        walterTheWaiter.whoCan(BrowseTheWeb.using(await BrowserFactory.create(config)));
    });

    afterAll(async () => {
        return BrowserFactory.cleanup()
    });

    describe('on the element itself', () => {
        const appearingButton = element(By.css("[data-test-id='AppearButtonBy5000']"))
            .called("Test appearing element after 5 seconds")
            .shallWait(UntilElement.is.visible().forAsLongAs(20000));

        const toBeEnabledButton = element(By.css("[data-test-id='EnabledButtonBy5000']"))
            .called("Test enabled element after 5 seconds")
            .shallWait(UntilElement.is.enabled().forAsLongAs(20000));

        const toBeDisabledButton = element(By.css("[data-test-id='DisabledButtonBy5000']"))
            .called("Test enabled element after 5 seconds")
            .shallWait(UntilElement.isNot.enabled().forAsLongAs(20000));

        const match = (expected: string) => {
            return (actual: string) => expect(expected).toEqual(actual);
        };

        it('should be possible with wait actions on an element ' +
            '- (test case id: 7fd0c550-e31c-42fd-96f8-4ceb50e6cf3b)', async () => {
            await walterTheWaiter.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(Text.of(appearingButton)).fulfills(match("Appeared after 5 seconds")),
            );
        });

        it('should be possible with wait actions on an element and a redirecting page ' +
            '- (test case id: 4406f09a-5b80-4106-b46a-9f2683faefc9)', async () => {
            await walterTheWaiter.attemptsTo(
                Navigate.to(`/redirect`),
                See.if(Text.of(appearingButton)).fulfills(match("Appeared after 5 seconds")),
            );
        });

        it('should be possible with wait actions on an to be enabled element ' +
            '- (test case id: 8419865d-b444-459d-8101-7e6912af1e08)', async () => {
            await walterTheWaiter.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(Text.of(toBeEnabledButton)).fulfills(match("Enabled after 5 seconds")),
            );
        });

        it('should be possible with wait actions on an to be disabled element ' +
            '- (test case id: a0899cd4-6548-4f15-ab19-579bd6ca1ccd)', async () => {
            await walterTheWaiter.attemptsTo(
                Navigate.to(`/delayed`),
                See.if(Text.of(toBeDisabledButton)).fulfills(match("Disabled after 5 seconds")),
            );
        });
    });

    describe('on the task flow', () => {
        const button = element(By.css("[data-test-id='buttonBehindModal']"))
            .called("button behind modal window");

        const modal = element(By.css("[id='ModalView']"))
            .called("The modal window");

        const match = (expected: string) => {
            return (actual: string) => expect(expected).toEqual(actual);
        };

        it('should time out when the timeout is reached' +
            '- (test case id: 5812e00b-580d-4330-899c-9f62cedc0a6e)', async () => {
            await walterTheWaiter.attemptsTo(
                Navigate.to(`/modals`),
                See.if(Text.of(button)).fulfills(match("Danger!")),
                Wait.for(modal).andCheck(UntilElement.isNot.visible().forAsLongAs(500)),
            )
                .then(() => {
                    expect(true).toBe(false, `Action should time out after 500ms but it doesnt`)
                })
                .catch((e) => {
                    expect(e.toString()).toContain("Waiting until element called 'The modal window' is not visible timed out after 500 ms.")
                });

        });

        it('should succeed after 5 seconds when the modal view is gone  ' +
            '- (test case id: c93f9af5-b5ea-49d2-99ba-45e7b31018b0)', async () => {
            await walterTheWaiter.attemptsTo(
                Navigate.to(`/modals`),
                See.if(Text.of(button)).fulfills(match("Danger!")),
                Wait.for(modal).andCheck(UntilElement.isNot.visible().forAsLongAs(10000)),
            )

        });
    });
});
