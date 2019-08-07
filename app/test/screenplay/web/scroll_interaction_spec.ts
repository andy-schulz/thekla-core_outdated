import {
    DesiredCapabilities,
    By,
    UntilElement,
    ServerConfig,
    Actor,
    BrowseTheWeb,
    RunningBrowser,
    Navigate, element, Scroll, Browser, Page
} from "../../../index";
import {BoundaryCheck, boundingRect, clientRect} from "../../0_helper/browser_viewport";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe(`Scroll`, (): void => {

    const lastTableRow = element(By.css(`[data-test-id='lastTableRow']`))
        .shallWait(UntilElement.is.visible().forAsLongAs(5000))
        .called(`Ththe last row element inside the large table`);

    const classNameOfLastRow = `lastTableRow`;

    const conf: ServerConfig = {
        serverAddress: {
            hostname: `localhost`
        }
    };

    const capabilities: DesiredCapabilities = {
        browserName: `chrome`,
    };



    describe(`to a pages position`, (): void => {
        let theBrowser: Browser;
        const Sam = Actor.named(`Sam`);

        beforeAll((): void => {
            // and give him the ability to browse the web using a browser of your choice
            theBrowser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            Sam.whoCan(BrowseTheWeb.using(theBrowser));
        });

        it(`should succeed when scrolled to the end of the page 
        - (test case id: 8fc292fe-883d-48ce-878e-11fcdff579df)`, async (): Promise<void> => {
            await Navigate.to(`http://framework-tester.test-steps.de/tables`).performAs(Sam);

            const rectStart: ClientRectList = await theBrowser.executeScript(clientRect) as ClientRectList;
            expect(rectStart[0].top).toBe(0);
            expect(rectStart[0].bottom).toBeGreaterThanOrEqual(7000);

            await Scroll.to(Page.bottom()).performAs(Sam);

            const rectEnd: ClientRectList = await theBrowser.executeScript(clientRect) as ClientRectList;
            expect(rectEnd[0].top).toBeLessThanOrEqual(6000);
            expect(rectEnd[0].bottom).toBeLessThanOrEqual(1000);

            await Scroll.to(Page.top()).performAs(Sam);

            const rectStart2: ClientRectList = await theBrowser.executeScript(clientRect) as ClientRectList;
            expect(rectStart2[0].top).toBe(0);
            expect(rectStart2[0].bottom).toBeGreaterThanOrEqual(7000);
        });
    });

    describe(`an element into view`, (): void => {
        let theBrowser: Browser;
        const Sam = Actor.named(`Sam`);

        beforeAll((): void => {
            // and give him the ability to browse the web using a browser of your choice
            theBrowser = RunningBrowser.startedOn(conf).withCapabilities(capabilities);
            Sam.whoCan(BrowseTheWeb.using(theBrowser));
        });

        it(`should move the element into the viewport 
        - (test case id: bc7ff4ef-d0ea-4ac1-b2c6-5cedefd11391)`, async (): Promise<void> => {

            await Navigate.to(`http://framework-tester.test-steps.de/tables`).performAs(Sam);


            const isOutsideViewOnFirstCheck: BoundaryCheck =
                await theBrowser.executeScript(boundingRect,classNameOfLastRow) as BoundaryCheck;

            expect(isOutsideViewOnFirstCheck.any).toBeTruthy();

            return Scroll.to(lastTableRow).performAs(Sam)
                .then(async (): Promise<void> => {
                    const isOutsideViewOnSecondCheck: BoundaryCheck =
                        await theBrowser.executeScript(boundingRect, classNameOfLastRow) as BoundaryCheck;
                    expect(isOutsideViewOnSecondCheck.any).toBeFalsy()
                })
        });
    });

    afterAll((): Promise<void[][]> => {
        return RunningBrowser.cleanup();
    })
});