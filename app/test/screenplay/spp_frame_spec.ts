import {
    Actor,
    RunningBrowser,
    BrowseTheWeb,
    By,
    DesiredCapabilities,
    element,
    frame,
    Navigate,
    See,
    Text,
    UntilElement,
    SeleniumConfig, strictEqualTo
} from "../..";

import {configure} from "log4js";
configure("res/config/log4js.json");

let config: SeleniumConfig = {
    seleniumServerAddress: `http://localhost:4444/wd/hub`,
    baseUrl: `http://localhost:3000`,
};

const capabilities: DesiredCapabilities = {
    browserName: `chrome`,
    proxy: {
        type: "direct"
    }
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('Locating Elements inside Frames', () => {
    let andy: Actor;

    beforeAll(async () => {
        andy = Actor.named("Andy");
        andy.whoCan(BrowseTheWeb.using(await RunningBrowser.startedOn(config).withDesiredCapability(capabilities)));
    });

    afterAll(async () => {
        return RunningBrowser.cleanup();
    });

    it('a separate frame change should not be necessary - (test case id: 68f90a8c-ec6c-445b-8276-14af079fc008)', async () => {
        const button = element(By.css(`.buttonoutsideframes button`));

        const frame1 = frame(By.css(`.frame-button-in-single-frame`));
        const button1 = frame1.element(By.css(`.btn-secondary`));

        const frame21 = frame(By.css(`.button-in-two-frames`));
        const frame22 = frame21.frame(By.css(`.frame-button-in-single-frame`));
        const button2 = frame22.element(By.css(`.btn-secondary`));

        await andy.attemptsTo(
            Navigate.to(`/nestedFrames`),
            See.if(Text.of(button)).is(strictEqualTo(`Button outside of Frame`)),
            See.if(Text.of(button1)).is(strictEqualTo(`Button inside single frame`)),
            See.if(Text.of(button)).is(strictEqualTo(`Button outside of Frame`)),
            See.if(Text.of(button2)).is(strictEqualTo(`Button nested inside frame of frame`)),
            See.if(Text.of(button)).is(strictEqualTo(`Button outside of Frame`)),
        );

    });


    it('should be possible with wait actions on each frame - (test case id: 19b9fce2-c15b-4b52-a9d5-4211b26602da)', async () => {
        const button = element(By.css(".buttonoutsideframes button"));

        const frame1 = frame(By.css(".frame-button-in-single-frame"))
            .shallWait(UntilElement.is.visible().forAsLongAs(5000));
        const button1 = frame1.element(By.css(".btn-secondary"));

        const frame21 = frame(By.css(".button-in-two-frames"))
            .shallWait(UntilElement.is.visible().forAsLongAs(5000));
        const frame22 = frame21.frame(By.css(".frame-button-in-single-frame"))
            .shallWait(UntilElement.is.visible().forAsLongAs(5000));
        const button2 = frame22.element(By.css(".btn-secondary"));

        await andy.attemptsTo(
            Navigate.to(`/nestedFrames`),
            See.if(Text.of(button)).is(strictEqualTo(`Button outside of Frame`)),
            See.if(Text.of(button1)).is(strictEqualTo(`Button inside single frame`)),
            See.if(Text.of(button)).is(strictEqualTo(`Button outside of Frame`)),
            See.if(Text.of(button2)).is(strictEqualTo(`Button nested inside frame of frame`)),
            See.if(Text.of(button)).is(strictEqualTo(`Button outside of Frame`)),
        );

    });
});
