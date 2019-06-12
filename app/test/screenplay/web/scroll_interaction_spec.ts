import {
    DesiredCapabilities,
    By,
    UntilElement,
    SeleniumConfig,
    Actor,
    BrowseTheWeb,
    RunningBrowser,
    Navigate, element, Scroll, Browser
}                                    from "../../../index";
import {BoundaryCheck, boundingRect} from "../../0_helper/browser_viewport";

describe(`Scroll`, (): void => {
    describe(`an element into view`, (): void => {
        let theBrowser: Browser;

        const lastTableRow = element(By.css(`[data-test-id='lastTableRow']`))
            .shallWait(UntilElement.is.visible().forAsLongAs(5000))
            .called(`Ththe last row element inside the large table`);

        const classNameOfLastRow = `lastTableRow`;

        const conf: SeleniumConfig = {
            seleniumServerAddress: `http://localhost:4444/wd/hub`,
        };

        const capabilities: DesiredCapabilities = {
            browserName: `chrome`,
        };

        const Sam = Actor.named(`Sam`);

        beforeAll((): void => {
            // and give him the ability to browse the web using a browser of your choice
            theBrowser = RunningBrowser.startedOn(conf).withDesiredCapability(capabilities);
            Sam.whoCan(BrowseTheWeb.using(theBrowser));
        });

        it(`should move the element into the viewport 
        - (test case id: bc7ff4ef-d0ea-4ac1-b2c6-5cedefd11391)`, async (): Promise<void> => {

            await Navigate.to(`https://teststepsframeworktester.azurewebsites.net/tables`).performAs(Sam);


            const isOutsideViewOnFirstCheck: BoundaryCheck =
                await theBrowser.executeScript(boundingRect,classNameOfLastRow) as BoundaryCheck;
            expect(isOutsideViewOnFirstCheck.any).toBeTruthy();

            await Scroll.to(lastTableRow).performAs(Sam)
                .then(async (): Promise<void> => {
                    const isOutsideViewOnSecondCheck: BoundaryCheck =
                        await theBrowser.executeScript(boundingRect, classNameOfLastRow) as BoundaryCheck;
                    expect(isOutsideViewOnSecondCheck.any).toBeFalsy()
                })
        });


        afterAll((): Promise<void[][]> => {
            return RunningBrowser.cleanup();
        })
    });
});