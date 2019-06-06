import {Actor}             from "../../..";
import {SkipTaskExecution} from "../../../screenplay/lib/tasks/SkipTaskExecution";

describe(`Using the task`, () => {
    describe(`SkipTaskExecution`, () => {
        it(`should succeed when using with an actor \
        - (test case id: 6ae28b5a-2202-46f8-95c5-4809b0b2ab6f)`,() => {
            const jonathan = Actor.named(`Jonathan`);

            return jonathan.attemptsTo(
                SkipTaskExecution.asNoDataWereFound(`of Jonathan's test data`)
            ).then((data): void => {
                expect(data).toBeUndefined()
            })
        });
    });
});