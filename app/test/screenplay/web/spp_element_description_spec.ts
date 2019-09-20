import {
    RunningBrowser,
    Actor,
    BrowseTheWeb,
    By,
    element,
    See,
    Navigate,
    Text,
    UntilElement,
    all,
    SppElement,
    ServerConfig, DesiredCapabilities, Expected
}                 from "../../../index";

import {getLogger}                                  from "log4js";
import {standardCapabilities, standardServerConfig} from "../../0_helper/config";
import _                                            from "lodash";

const logger = getLogger(`Spec: SppElementDescription`);

describe(`The description on an element`, (): void => {

    const seleniumConfig: ServerConfig = _.cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = _.cloneDeep(standardCapabilities);

    logger.trace(`Test Started`);

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    describe(`should be attached to the element`, (): void => {

        it(`by using the  
        - (test case id: 161de6a4-2f53-4864-832a-2e291fc250d6)`, (): void => {
            const testButton =
                element(By.css(`#doesNotExistOnLevelOne`))
                    .called(`Test Button description on level one`);

            expect(testButton.toString()).toEqual(`Test Button description on level one located by >>byCss: #doesNotExistOnLevelOne<<`)
        });

        it(`with a wait stepDetails 
        - (test case id: 161de6a4-2f53-4864-832a-2e291fc250d6)`, (): void => {
            const testButton =
                element(By.css(`#doesNotExistOnLevelOne`))
                    .shallWait(UntilElement.is.visible())
                    .called(`Test Button description on level one`);

            expect(testButton.toString()).toEqual(`Test Button description on level one located by >>byCss: #doesNotExistOnLevelOne<<`)
        });

        it(`with a wait stepDetails after the description is set 
        - (test case id: 161de6a4-2f53-4864-832a-2e291fc250d6)`, (): void => {
            const testButton =
                element(By.css(`#doesNotExistOnLevelOne`))
                    .called(`Test Button description on level one`)
                    .shallWait(UntilElement.is.visible());

            expect(testButton.toString()).toEqual(`Test Button description on level one located by >>byCss: #doesNotExistOnLevelOne<<`)
        });

        it(`with a wait stepDetails after the description is set 
        - (test case id: 161de6a4-2f53-4864-832a-2e291fc250d6)`, (): void => {
            const testButton =
                element(By.css(`#doesNotExistOnLevelOne`))
                    .called(`Test Button description on level one`)
                    .shallWait(UntilElement.is.visible())
                    .called(`The second description of the Test Button description on level one`);

            expect(testButton.toString()).toEqual(`Test Button description on level one -> The second description of the Test Button description on level one located by >>byCss: #doesNotExistOnLevelOne<<`)
        });

        it(`with a wait stepDetails after the description is set 
        - (test case id: 161de6a4-2f53-4864-832a-2e291fc250d6)`, (): void => {
            const testButton =
                element(By.css(`#doesNotExistOnLevelOne`))
                    .called(`Test Button description on level one`)
                    .element(By.css(`#doesNotExistOnLevelOne`))
                    .shallWait(UntilElement.is.visible())
                    .called(`The second description of the Test Button description on level one`);

            expect(testButton.toString()).toEqual(`Test Button description on level one -> The second description of the Test Button description on level one located by >>byCss: #doesNotExistOnLevelOne<<`)
        });

        it(`with a wait stepDetails after the description is set 
        - (test case id: 161de6a4-2f53-4864-832a-2e291fc250d6)`, (): void => {
            const testButton =
                element(By.css(`#doesNotExistOnLevelOne`))
                    .called(`Test Button description on level one`)
                    .element(By.css(`#doesNotExistOnLevelOne`))
                    .shallWait(UntilElement.is.visible());

            expect(testButton.toString()).toEqual(`Test Button description on level one located by >>byCss: #doesNotExistOnLevelOne<<`)
        });
    });

    describe(`should be thrown in case of an error`, (): void => {
        let Edward: Actor;

        beforeAll((): void => {
            Edward = Actor.named(`Edward`);
            Edward.whoCan(BrowseTheWeb.using(RunningBrowser.startedOn(seleniumConfig).withCapabilities(capabilities)));
        });

        afterAll(async (): Promise<void[]> => {
            return RunningBrowser.cleanup();
        });

        const description = `Test Element description in case an error is thrown`;
        const match = (expected: string): (actual: string) => boolean => {
            return (actual: string): boolean => expect(actual).toEqual(expected);
        };

        const checkErrorMessage = async (elem: SppElement): Promise<void> => {
            const callback = {catchfn: (): (actual: string) => boolean => match(description)};
            spyOn(callback, `catchfn`).and.callThrough();

            await Edward.attemptsTo(
                Navigate.to(`/`),
                See.if(Text.of(elem)).is(Expected.toEqual(`There is no waiter to test`)),
            ).catch(callback.catchfn);

            expect(callback.catchfn).toHaveBeenCalled();
            expect(callback.catchfn).toHaveBeenCalledTimes(1);
        };

        it(`when it is attached to level one of the element chain 
        - (test case id: 2332afe2-5d61-488c-b4e1-398b34947d82)`, async (): Promise<void> => {
            const button = element(By.css(`.elementDoesNotExist`))
                .called(description);
            return checkErrorMessage(button)
        }, 20000);

        it(`when it is attached to level two of the element chain 
        - (test case id: 13f9ee79-5755-4ad0-b77a-12dc547f7200)`, async (): Promise<void> => {
            const button = element(By.css(`div`))
                .element(By.css(`.elementDoesNotExist`))
                .called(description);
            return checkErrorMessage(button)
        }, 20000);

        it(`when it is attached to level one with two levels of an element chain 
        - (test case id: 082e0f44-9dae-4283-adf2-05bba017fd10)`, async (): Promise<void> => {
            const button = element(By.css(`div`))
                .called(description)
                .element(By.css(`.elementDoesNotExist`));
            return checkErrorMessage(button)
        }, 20000);

        it(`when it is attached to level one of the element list chain 
        - (test case id: d6a644fd-cfe0-42fb-b865-0b281196cd4b)`, async (): Promise<void> => {
            const allElems = all(By.css(`.doesnotexist`))
                .called(description)
                .element(By.css(`.more`));
            return checkErrorMessage(allElems);
        }, 20000);

        it(`when it is attached to level two of the element list chain 
        - (test case id:a2a66832-307a-43c2-9c7e-966b95743fe3 )`, async (): Promise<void> => {
            const button = all(By.css(`div`))
                .element(By.css(`.elementDoesNotExist`))
                .called(description);
            return checkErrorMessage(button);
        }, 20000);

        it(`on different chaining stages 
        - (test case id: 51807468-c3d5-4e96-9a2e-1b89ee926ee4)`, async (): Promise<void> => {
            const description = `Test Element description in case an error is thrown`;
            const button = element(By.css(`.elementDoesNotExist`))
                .called(description)
                .shallWait(UntilElement.is.visible());

            return checkErrorMessage(button);
        }, 20000);

    });
});
