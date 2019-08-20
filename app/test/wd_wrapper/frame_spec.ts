import {configure} from "log4js";
import {
    Browser, By, UntilElement, ServerConfig, DesiredCapabilities, ClientHelper
}                  from "../..";
import {LogLevel}  from "../../config/ServerConfig";
configure(`res/config/log4js.json`);


describe(`trying to access a Frame`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    const conf: ServerConfig = {
        automationFramework: {
            type: process.env.FRAMEWORK === `wdio` ? `wdio` : `wdjs`,
            logLevel:  (process.env.LOGLEVEL ? process.env.LOGLEVEL : `info`) as LogLevel
        },
        serverAddress: {
            hostname: `localhost`
        },
        baseUrl: process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`,
    };

    const capabilities: DesiredCapabilities = {
        browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `firefox`,
        proxy: {
            type: `system`,
        }
    };

    let browser: Browser;

    beforeAll((): void => {
        browser = ClientHelper.create(conf, capabilities);
    });

    afterAll(async (): Promise<void[][]> => {
        return ClientHelper.cleanup();
    });

    describe(`on the first Level by`, (): void => {

        it(`css -> the frame should be found.  
        - (test case id: 68a541be-2a49-4177-bb1d-251136c3e569)`, async (): Promise<void> => {
            const frame = browser.frame(By.css(`.frame-button-in-single-frame`));
            const button = frame.element(By.css(`.btn-secondary`));

            await browser.get(`/nestedFrames`);

            expect(await button.getText()).toEqual(`Button inside single frame`);
        });

        it(`css and explicit waiting -> the frame should be found. 
        - (test case id: 189c9d59-c31a-4e9d-9c4e-e43dc0302868)`, async (): Promise<void> => {
            const frame = browser.frame(By.css(`.frame-button-in-single-frame`))
                .shallWait(UntilElement.is.visible().forAsLongAs(5000));
            const button = frame.element(By.css(`.btn-secondary`));

            await browser.get(`/nestedFrames`);
            expect(await button.getText()).toEqual(`Button inside single frame`);
            // expect(await button.getText()).toEqual("Button inside single frame");
        });

        it(`and double waiting -> the frame should be found. 
        - (test case id: f5622a85-b3ac-4e51-8772-d72bcde4e96c)`, async (): Promise<void> => {
            const frame = browser.frame(By.css(`.frame-button-in-single-frame`))
                .shallWait(UntilElement.is.visible().forAsLongAs(10000))
                .shallWait(UntilElement.is.enabled().forAsLongAs(10000));
            const button = frame.element(By.css(`.btn-secondary`))
                .shallWait(UntilElement.is.visible().forAsLongAs(10000));

            await browser.get(`/nestedFrames`);
            expect(await button.getText()).toEqual(`Button inside single frame`);
        });

        it(`the frame and elements inside it should be found after a page redirect. 
        - (test case id: 6f5efcda-10d4-43f5-8465-13e8b6eff8a3)`, async (): Promise<void> => {
            const frame = browser.frame(By.css(`.frame-button-in-single-frame`))
                .shallWait(UntilElement.is.visible().forAsLongAs(10000));
            const button = frame.element(By.css(`.btn-secondary`));

            await browser.get(`/redirectToFrames`);
            expect(await button.getText()).toEqual(`Button inside single frame`);
        });
    });

    describe(`on the second Level by`, (): void => {

        it(`css -> the button in frame of frame should be found.  
        - (test case id: 7baa9c43-563b-4ef1-8cf4-f11d5fc8601b)`, async (): Promise<void> => {
            const frame1 = browser.frame(By.css(`.frame-button-in-single-frame`));
            const frame21 = browser.frame(By.css(`.button-in-two-frames`));
            const frame22 = frame21.frame(By.css(`.frame-button-in-single-frame`));

            const button1 = frame1.element(By.css(`.btn-secondary`));
            const button2 = frame22.element(By.css(`.btn-secondary`));

            await browser.get(`/nestedFrames`);
            expect(await button1.getText()).toEqual(`Button inside single frame`);
            expect(await button2.getText()).toEqual(`Button nested inside frame of frame`);

            // try to access the first button again to check that the frameswitch works
            expect(await button1.getText()).toEqual(`Button inside single frame`);
        });


        it(`css and explicit waiting -> the button in frame of frame should be found. 
        - (test case id: 53675bf6-eea9-46f0-b487-b969a7629e27)`, async (): Promise<void> => {
            const frame1 = browser.frame(By.css(`.frame-button-in-single-frame`));
            const frame21 = browser.frame(By.css(`.button-in-two-frames`));
            const frame22 = frame21.frame(By.css(`.frame-button-in-single-frame`))
                .shallWait(UntilElement.is.visible());

            const button1 = frame1.element(By.css(`.btn-secondary`));
            const button2 = frame22.element(By.css(`.btn-secondary`));

            await browser.get(`/nestedFrames`);
            expect(await button1.getText()).toEqual(`Button inside single frame`);
            expect(await button2.getText()).toEqual(`Button nested inside frame of frame`);

            // try to access the first button again to check that the frameswitch works
            expect(await button1.getText()).toEqual(`Button inside single frame`);
        });

        it(`css and explicit waiting -> all buttons, inside and outside of frames should be found. 
        - (test case id: 8a4d4171-0c02-43a7-a635-10688d91298b)`, async (): Promise<void> => {
            const button = browser.element(By.css(`.buttonoutsideframes button`));

            const frame1 = browser.frame(By.css(`.frame-button-in-single-frame`));
            const frame21 = browser.frame(By.css(`.button-in-two-frames`));
            const frame22 = frame21.frame(By.css(`.frame-button-in-single-frame`))
                .shallWait(UntilElement.is.visible());

            const button1 = frame1.element(By.css(`.btn-secondary`));
            const button2 = frame22.element(By.css(`.btn-secondary`));

            await browser.get(`/nestedFrames`);
            expect(await button.getText()).toEqual(`Button outside of Frame`);
            expect(await button1.getText()).toEqual(`Button inside single frame`);
            expect(await button2.getText()).toEqual(`Button nested inside frame of frame`);

            // try to access the first button again to check that the frameswitch works
            expect(await button1.getText()).toEqual(`Button inside single frame`);
            expect(await button.getText()).toEqual(`Button outside of Frame`);
        });

    });
});