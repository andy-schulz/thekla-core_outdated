import {
    DesiredCapabilities,
    By,
    UntilElement,
    ServerConfig,
    Actor,
    BrowseTheWeb,
    RunningBrowser,
    Navigate, element, See, Text, Expected, Status, Hover
}                                                   from "../../../index";
import {standardCapabilities, standardServerConfig} from "../../0_helper/config";
import _                                            from "lodash";

describe(`Hover`, (): void => {

    const conf: ServerConfig = _.cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = _.cloneDeep(standardCapabilities);
    const testUrl = process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`;

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

        const Howard = Actor.named(`Howard`);

        beforeAll((): void => {
            // and give him the ability to browse the web using a browser of your choice
            Howard.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(conf).withCapabilities(capabilities)));
        });

        it(`should display additional information 
        - (test case id: f45a3fa4-896c-47d7-bc2f-d77d07a046d3)`, (): Promise<void> => {
            return Howard.attemptsTo(
                Navigate.to(testUrl),
                See.if(Status.visible.of(userName)).is(Expected.toBe(false)),
                Hover.over(userIcon),
                See.if(Status.visible.of(userName)).is(Expected.toBe(true)),
                See.if(Text.of(userName)).is(Expected.toBe(`Name: User Name`))
            )
        });

        it(`should not display the hover when another element is hovered upon 
        - (test case id: 6347d82f-c2a2-4bdb-8913-9633f0849352)`, (): Promise<void> => {
            return Howard.attemptsTo(
                Navigate.to(testUrl),
                See.if(Status.visible.of(userName)).is(Expected.toBe(false)),
                Hover.over(userIcon),
                See.if(Status.visible.of(userName)).is(Expected.toBe(true)),
                See.if(Text.of(userName)).is(Expected.toBe(`Name: User Name`)),
                Hover.over(button),
                See.if(Status.visible.of(userName)).is(Expected.toBe(false)),
            )
        });

        afterAll((): Promise<void[]> => {
            return RunningBrowser.cleanup();
        })
    });
});