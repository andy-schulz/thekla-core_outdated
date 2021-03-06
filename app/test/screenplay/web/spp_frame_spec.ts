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
    ServerConfig, Expected
}                                                                               from "../../..";
import {configure}                                                              from "log4js";
import {setBrowserStackSessionName, standardCapabilities, standardServerConfig} from "../../0_helper/config";
import {cloneDeep}                                                              from "lodash";

configure(`res/config/log4js.json`);

describe(`Locating Elements inside Frames`, (): void => {

    const config: ServerConfig = cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = cloneDeep(standardCapabilities);
    setBrowserStackSessionName(capabilities, `spp_frame_spec.ts`);

    let Francine: Actor;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        Francine = Actor.named(`Francine`);
        Francine.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(config).withCapabilities(capabilities)));
    });

    afterAll(async (): Promise<void[]> => {
        return RunningBrowser.cleanup();
    });

    it(`a separate frame change should not be necessary 
    - (test case id: 68f90a8c-ec6c-445b-8276-14af079fc008)`, async (): Promise<void> => {
        const button = element(By.css(`.buttonoutsideframes button`));

        const frame1 = frame(By.css(`.frame-button-in-single-frame`));
        const button1 = frame1.element(By.css(`.btn-secondary`));

        const frame21 = frame(By.css(`.button-in-two-frames`));
        const frame22 = frame21.frame(By.css(`.frame-button-in-single-frame`));
        const button2 = frame22.element(By.css(`.btn-secondary`));

        await Francine.attemptsTo(
            Navigate.to(`/nestedFrames`),
            See.if(Text.of(button)).is(Expected.toEqual(`Button outside of Frame`)),
            See.if(Text.of(button1)).is(Expected.toEqual(`Button inside single frame`)),
            See.if(Text.of(button)).is(Expected.toEqual(`Button outside of Frame`)),
            See.if(Text.of(button2)).is(Expected.toEqual(`Button nested inside frame of frame`)),
            See.if(Text.of(button)).is(Expected.toEqual(`Button outside of Frame`)),
        );

    });

    it(`should be possible with wait actions on each frame 
    - (test case id: 19b9fce2-c15b-4b52-a9d5-4211b26602da)`, async (): Promise<void> => {
        const button = element(By.css(`.buttonoutsideframes button`));

        const frame1 = frame(By.css(`.frame-button-in-single-frame`))
            .shallWait(UntilElement.is.visible().forAsLongAs(5000));
        const button1 = frame1.element(By.css(`.btn-secondary`));

        const frame21 = frame(By.css(`.button-in-two-frames`))
            .shallWait(UntilElement.is.visible().forAsLongAs(5000));
        const frame22 = frame21.frame(By.css(`.frame-button-in-single-frame`))
            .shallWait(UntilElement.is.visible().forAsLongAs(5000));
        const button2 = frame22.element(By.css(`.btn-secondary`));

        await Francine.attemptsTo(
            Navigate.to(`/nestedFrames`),
            See.if(Text.of(button)).is(Expected.toEqual(`Button outside of Frame`)),
            See.if(Text.of(button1)).is(Expected.toEqual(`Button inside single frame`)),
            See.if(Text.of(button)).is(Expected.toEqual(`Button outside of Frame`)),
            See.if(Text.of(button2)).is(Expected.toEqual(`Button nested inside frame of frame`)),
            See.if(Text.of(button)).is(Expected.toEqual(`Button outside of Frame`)),
        );

    });
});
