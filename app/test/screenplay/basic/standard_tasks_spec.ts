import {Actor, PerformsTask, step, Task} from "../../..";
import {SkipTask}                        from "../../../screenplay/lib/tasks/SkipTask";

interface MyNewData {
    theData: string;
}

class MyNewTask extends Task<void, void> {

    @step<PerformsTask,void,void>(`execute the empty task`)
    public performAs(actor: PerformsTask,): Promise<void> {
        return Promise.resolve();
    }

    public static shallBeStartedWith(theData: MyNewData | undefined): MyNewTask | SkipTask {
        if (!theData)
            return SkipTask
                .called(MyNewTask.name)
                .withMessage(`no data was passed`);

        return new MyNewTask(theData);
    }

    private constructor(private myData: MyNewData) {
        super();
    }

}

describe(`Using the task`, (): void => {
    describe(`SkipTask`, (): void => {

        it(`should succeed when passing the task name as a string
        - (test case id: 6ae28b5a-2202-46f8-95c5-4809b0b2ab6f)`,(): Promise<void> => {
            const jonathan = Actor.named(`Jonathan`);

            return jonathan.attemptsTo(
                SkipTask.called(`EmptyTask`)
            ).then((data): void => {
                expect(data).toBeUndefined()
            })
        });

        it(`should succeed when passing the task name and an additional message as a string
        - (test case id: 92893a03-46cf-430d-ac48-558b08a6d29b)`,(): Promise<void> => {
            const jonathan = Actor.named(`Jonathan`);

            return jonathan.attemptsTo(
                SkipTask
                    .called(`EmptyTask`)
                    .withMessage(`my new message`)
            ).then((data): void => {
                expect(data).toBeUndefined()
            })
        });

        it(`should succeed when passing the task name and an additional message as a string
        - (test case id: 92893a03-46cf-430d-ac48-558b08a6d29b)`,(): Promise<void> => {
            const jonathan = Actor.named(`Jonathan`);

            return jonathan.attemptsTo(
                MyNewTask.shallBeStartedWith(undefined)
            ).then((data): void => {
                expect(data).toBeUndefined()
            })
        });
    });
});