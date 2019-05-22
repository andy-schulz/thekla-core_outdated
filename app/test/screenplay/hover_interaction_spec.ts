import {
    DesiredCapabilities,
    By,
    UntilElement,
    SeleniumConfig,
    Actor,
    BrowseTheWeb,
    RunningBrowser,
    Navigate, element, See, Text, Expected, Status, Hover
} from "../..";

describe(`Hover`, (): void => {
    describe(`over an elements`, (): void => {
        const userIcon = element(By.css(`[data-test-id='usericon']`))
            .shallWait(UntilElement.is.visible().forAsLongAs(5000))
            .called(`The user icon which displays an information box when hovered upon`);

        const userName = element(By.css(`[data-test-id='hoverusername']`))
            .shallWait(UntilElement.is.visible().forAsLongAs(5000))
            .called(`the user name inside the hover information box`);

        const button = element(By.css(`[data-test-id='button']`))
            .shallWait(UntilElement.is.visible().forAsLongAs(5000))
            .called(`the general danger button in red`);

        const conf: SeleniumConfig = {
            seleniumServerAddress: `http://localhost:4444/wd/hub`,
        };

        const capabilities: DesiredCapabilities = {
            browserName: `chrome`,
        };

        const Howard = Actor.named(`Howard`);

        beforeAll((): void => {
            // and give him the ability to browse the web using a browser of your choice
            Howard.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(conf).withDesiredCapability(capabilities)));
        });

        it(`should display additional information 
        - (test case id: bc7ff4ef-d0ea-4ac1-b2c6-5cedefd11391)`, (): Promise<void> => {
            return Howard.attemptsTo(
                Navigate.to(`http://localhost:3000`),
                See.if(Status.visible.of(userName)).is(Expected.toBe(false)),
                Hover.over(userIcon),
                See.if(Status.visible.of(userName)).is(Expected.toBe(true)),
                See.if(Text.of(userName)).is(Expected.toBe(`Name: User Name`))
            )
        });

        it(`should not display the hover when another element is hovered upon 
        - (test case id: bc7ff4ef-d0ea-4ac1-b2c6-5cedefd11391)`, (): Promise<void> => {
            return Howard.attemptsTo(
                Navigate.to(`http://localhost:3000`),
                See.if(Status.visible.of(userName)).is(Expected.toBe(false)),
                Hover.over(userIcon),
                See.if(Status.visible.of(userName)).is(Expected.toBe(true)),
                See.if(Text.of(userName)).is(Expected.toBe(`Name: User Name`)),
                Hover.over(button),
                See.if(Status.visible.of(userName)).is(Expected.toBe(false)),
            )
        });

        afterAll((): Promise<void[][]> => {
            return RunningBrowser.cleanup();
        })
    });
});