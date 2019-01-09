import {
    Browser, CapabilitiesWdjs, By, UntilElement
}                    from "../..";
import {BrowserWdjs} from "../../driver/wdjs/BrowserWdjs";

const conf: CapabilitiesWdjs = {
    browserName: "chrome",
    serverUrl: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost:3000"
};



describe('trying to access a Frame', () => {
    let browser: Browser;

    beforeAll(() => {
        browser = BrowserWdjs.create(conf);
    });

    afterAll(async () => {
        return BrowserWdjs.cleanup();
    });

    describe('on the first Level by', () => {

        it('css -> the frame should be found.  - (test case id: 68a541be-2a49-4177-bb1d-251136c3e569)', async () => {
            const frame = browser.frame(By.css(".button-in-single-frame"));
            const button = frame.element(By.css(".btn-secondary"));

            await browser.get(`/nestedFrames`);

            expect(await button.getText()).toEqual("Button inside single frame");
        }, 20000);

        it('css and explicit waiting -> the frame should be found. - (test case id: 189c9d59-c31a-4e9d-9c4e-e43dc0302868)', async () => {
            const frame = browser.frame(By.css(".button-in-single-frame"))
                .shallWait(UntilElement.isVisible().forAsLongAs(5000));
            const button = frame.element(By.css(".btn-secondary"));

            await browser.get(`/nestedFrames`);
            expect(await button.getText()).toEqual("Button inside single frame");
            // expect(await button.getText()).toEqual("Button inside single frame");
        }, 20000);
    });

    describe(`on the second Level by`, () => {

        it('css -> the button in frame of frame should be found.  - (test case id: 7baa9c43-563b-4ef1-8cf4-f11d5fc8601b)', async () => {
            const frame1 = browser.frame(By.css(".button-in-single-frame"));
            const frame21 = browser.frame(By.css(".button-in-two-frames"));
            const frame22 = frame21.frame(By.css(".button-in-single-frame"));

            const button1 = frame1.element(By.css(".btn-secondary"));
            const button2 = frame22.element(By.css(".btn-secondary"));

            await browser.get(`/nestedFrames`);
            expect(await button1.getText()).toEqual("Button inside single frame");
            expect(await button2.getText()).toEqual("Button nested inside frame of frame");

            // try to access the first button again to check that the frameswitch works
            expect(await button1.getText()).toEqual("Button inside single frame");
        }, 20000);


        it('css and explicit waiting -> the button in frame of frame should be found. - (test case id: 53675bf6-eea9-46f0-b487-b969a7629e27)', async () => {
            const frame1 = browser.frame(By.css(".button-in-single-frame"));
            const frame21 = browser.frame(By.css(".button-in-two-frames"));
            const frame22 = frame21.frame(By.css(".button-in-single-frame"))
                .shallWait(UntilElement.isVisible());

            const button1 = frame1.element(By.css(".btn-secondary"));
            const button2 = frame22.element(By.css(".btn-secondary"));

            await browser.get(`/nestedFrames`);
            expect(await button1.getText()).toEqual("Button inside single frame");
            expect(await button2.getText()).toEqual("Button nested inside frame of frame");

            // try to access the first button again to check that the frameswitch works
            expect(await button1.getText()).toEqual("Button inside single frame");
        }, 20000);

        it('css and explicit waiting -> all buttons, inside and outside of frames should be found. - (test case id: 8a4d4171-0c02-43a7-a635-10688d91298b)', async () => {
            const button = browser.element(By.css(".buttonoutsideframes button"));

            const frame1 = browser.frame(By.css(".button-in-single-frame"));
            const frame21 = browser.frame(By.css(".button-in-two-frames"));
            const frame22 = frame21.frame(By.css(".button-in-single-frame"))
                .shallWait(UntilElement.isVisible());

            const button1 = frame1.element(By.css(".btn-secondary"));
            const button2 = frame22.element(By.css(".btn-secondary"));

            await browser.get(`/nestedFrames`);
            expect(await button.getText()).toEqual("Button outside of Frame");
            expect(await button1.getText()).toEqual("Button inside single frame");
            expect(await button2.getText()).toEqual("Button nested inside frame of frame");

            // try to access the first button again to check that the frameswitch works
            expect(await button1.getText()).toEqual("Button inside single frame");
            expect(await button.getText()).toEqual("Button outside of Frame");
        }, 20000);


    });
});