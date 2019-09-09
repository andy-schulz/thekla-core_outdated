import {Actor, PerformsTask, Sleep, step, Task} from "../../..";
import {ActivityLogNode}                        from "../../../packages/ActivityLog/ActivityLogEntry";
import {SkipTask}                               from "../../../screenplay/lib/tasks/SkipTask";

interface MyNewData {
    theData: string;
}

class MyNewTask extends Task<void, void> {

    @step<PerformsTask, void, void>(`execute the empty task`)
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
        - (test case id: 6ae28b5a-2202-46f8-95c5-4809b0b2ab6f)`, (): Promise<void> => {
            const jonathan = Actor.named(`Jonathan`);

            return jonathan.attemptsTo(
                SkipTask.called(`EmptyTask`)
            ).then((data): void => {
                expect(data).toBeUndefined()
            })
        });

        it(`should succeed when passing the task name and an additional message as a string
        - (test case id: 92893a03-46cf-430d-ac48-558b08a6d29b)`, (): Promise<void> => {
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
        - (test case id: 31ddff99-02c2-4213-bfe7-ed60d0f2bb60)`, (): Promise<void> => {
            const jonathan = Actor.named(`Jonathan`);

            return jonathan.attemptsTo(
                MyNewTask.shallBeStartedWith(undefined)
            ).then((data): void => {
                expect(data).toBeUndefined()
            })
        });
    });

    describe(`with a step description`, (): void => {

        class MyFirstTask extends Task<void, void> {

            @step<PerformsTask, void, void>(`execute the first task`)
            public performAs(actor: PerformsTask,): Promise<void> {
                return actor.attemptsTo(
                    MyNewTask.shallBeStartedWith(undefined)
                )
            }

            public static startsNow(): MyFirstTask {
                return new MyFirstTask();
            }

            private constructor() {
                super();
            }

        }

        it(`should create only the activity log root node when no activities are passed
        - (test case id: 3b452b2b-d9eb-4d23-b5d0-23eb42703755)`, async (): Promise<void> => {
            const logan = Actor.named(`Logan`);

            await logan.attemptsTo(
            );

            const expected: ActivityLogNode = {
                name: `START`,
                description: `Logan starts Testing`,
                activityNodes: []
            };

            const expectedStructuredLog = `[START] - Logan starts Testing`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`  `)).toEqual(expectedStructuredLog);
        });

        it(`should create a single skip activity log for the actor when a skip task is passed
        - (test case id: a142f956-1bd6-4009-91cf-0c43eec9e780)`, async (): Promise<void> => {
            const logan = Actor.named(`Logan`);
            const noData = undefined;

            await logan.attemptsTo(
                MyNewTask.shallBeStartedWith(noData)
            );

            const expected: ActivityLogNode = {
                name: `START`,
                description: `Logan starts Testing`,
                activityNodes: [
                    {
                        name: `SkipTask`,
                        description: `Logan skips the task 'MyNewTask' with reason: 'no data was passed'`,
                        activityNodes: []
                    }
                ]
            };
            const expectedStructuredLog =
                `[START] - Logan starts Testing
  [SkipTask] - Logan skips the task 'MyNewTask' with reason: 'no data was passed'`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`  `)).toEqual(expectedStructuredLog);

        });

        it(`should create a single task activity log for the actor when one task is passed
        - (test case id: 8b93a1a9-98c5-417a-a0a1-6e36f6fdaff7)`, async (): Promise<void> => {
            const logan = Actor.named(`Logan`);
            const withData: MyNewData = {theData: `test`};

            await logan.attemptsTo(
                MyNewTask.shallBeStartedWith(withData)
            );

            const expected: ActivityLogNode = {
                name: `START`,
                description: `Logan starts Testing`,
                activityNodes: [
                    {
                        name: `MyNewTask`,
                        description: `Logan attempts to execute the empty task`,
                        activityNodes: []
                    }
                ]
            };

            const expectedStructuredLog =
                `[START] - Logan starts Testing
  [MyNewTask] - Logan attempts to execute the empty task`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`  `)).toEqual(expectedStructuredLog);

        });

        it(`should create a double task activity log for the actor when one task and one skip task is passed
        - (test case id: eb1de1e8-8bde-48a8-8c9d-55da61986974)`, async (): Promise<void> => {
            const logan = Actor.named(`Logan`);
            const noData = undefined;
            const data: MyNewData = {theData: `test`};

            await logan.attemptsTo(
                MyNewTask.shallBeStartedWith(data),
                MyNewTask.shallBeStartedWith(noData)
            );

            const expected: ActivityLogNode = {
                name: `START`,
                description: `Logan starts Testing`,
                activityNodes: [
                    {
                        name: `MyNewTask`,
                        description: `Logan attempts to execute the empty task`,
                        activityNodes: []
                    },
                    {
                        name: `SkipTask`,
                        description: `Logan skips the task 'MyNewTask' with reason: 'no data was passed'`,
                        activityNodes: []
                    }
                ]
            };

            const expectedStructuredLog =
                `[START] - Logan starts Testing
  [MyNewTask] - Logan attempts to execute the empty task
  [SkipTask] - Logan skips the task 'MyNewTask' with reason: 'no data was passed'`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`  `)).toEqual(expectedStructuredLog);

        });

        it(`should create a hierarchical activity log for the actor when one task is started by another task
        - (test case id: d7cf9239-5a90-45cc-9719-02228c274224)`, async (): Promise<void> => {
            const logan = Actor.named(`Logan`);
            const noData = undefined;

            await logan.attemptsTo(
                MyFirstTask.startsNow(),
                MyNewTask.shallBeStartedWith(noData)
            );

            const expected: ActivityLogNode = {
                name: `START`,
                description: `Logan starts Testing`,
                activityNodes: [
                    {
                        name: `MyFirstTask`,
                        description: `Logan attempts to execute the first task`,
                        activityNodes: [{
                            name: `SkipTask`,
                            description: `Logan skips the task 'MyNewTask' with reason: 'no data was passed'`,
                            activityNodes: []
                        }]
                    },
                    {
                        name: `SkipTask`,
                        description: `Logan skips the task 'MyNewTask' with reason: 'no data was passed'`,
                        activityNodes: []
                    }
                ]
            };

            const expectedStructuredLog =
                `[START] - Logan starts Testing
  [MyFirstTask] - Logan attempts to execute the first task
    [SkipTask] - Logan skips the task 'MyNewTask' with reason: 'no data was passed'
  [SkipTask] - Logan skips the task 'MyNewTask' with reason: 'no data was passed'`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`  `)).toEqual(expectedStructuredLog);
        });
    });

    describe(`with a stepDetails description`, (): void => {

        class MySleepTask extends Task<void, void> {

            @step<PerformsTask, void, void>(`execute the sleep task`)
            public performAs(actor: PerformsTask,): Promise<void> {
                return actor.attemptsTo(
                    Sleep.for(1)
                )
            }

            public static startsNow(): MySleepTask {
                return new MySleepTask();
            }

            private constructor() {
                super();
            }

        }

        it(`should create a single sleep activity log for the actor 
        - (test case id: f359ea34-3986-4664-a09f-bd9ad11a0d18)`, async (): Promise<void> => {
            const logan = Actor.named(`Logan`);

            await logan.attemptsTo(
                Sleep.for(1)
            );

            const expected: ActivityLogNode = {
                name: `START`,
                description: `Logan starts Testing`,
                activityNodes: [{
                    name: `Sleep`,
                    description: `Logan attempts to wait for '<<not found>>' ms`,
                    activityNodes: []
                }]
            };

            const expectedStructuredLog =
                `[START] - Logan starts Testing
....[Sleep] - Logan attempts to wait for '<<not found>>' ms`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`....`)).toEqual(expectedStructuredLog);
        });

        it(`should create a hierarchical sleep activity for the actor 
        - (test case id: 430b2281-7d06-471e-9e75-a2236f0d24eb)`, async (): Promise<void> => {
            const logan = Actor.named(`Logan`);

            await logan.attemptsTo(
                Sleep.for(1),
                MySleepTask.startsNow()
            );

            const expected: ActivityLogNode = {
                name: `START`,
                description: `Logan starts Testing`,
                activityNodes: [
                    {
                        name: `Sleep`,
                        description: `Logan attempts to wait for '<<not found>>' ms`,
                        activityNodes: []
                    },
                    {
                        name: `MySleepTask`,
                        description: `Logan attempts to execute the sleep task`,
                        activityNodes: [
                            {
                                name: `Sleep`,
                                description: `Logan attempts to wait for '<<not found>>' ms`,
                                activityNodes: []
                            }
                        ]
                    }]
            };

            const expectedStructuredLog =
`[START] - Logan starts Testing
....[Sleep] - Logan attempts to wait for '<<not found>>' ms
....[MySleepTask] - Logan attempts to execute the sleep task
........[Sleep] - Logan attempts to wait for '<<not found>>' ms`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`....`)).toEqual(expectedStructuredLog);
        });
    });
});