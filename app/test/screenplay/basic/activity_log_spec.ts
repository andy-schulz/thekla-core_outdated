import * as fs               from "fs";
import {ActivityLogNode, Actor, PerformsTask, Task, Sleep, step, SkipTask}     from "../../..";

interface MyNewData {
    theData: string;
}

class MyNewTask extends Task<void, void> {

    @step<PerformsTask, void, void>(`execute the empty task to test the log activity`)
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

describe(`The ActivityLog`, (): void => {

    class MyFailingTask extends Task<void, void> {

        @step<PerformsTask, void, void>(`execute a failing Task`)
        public performAs(actor: PerformsTask, result: void): Promise<void> {
            return Promise.reject();
        }

        public startsNow() {
            return new MyFailingTask();
        }

        public static startsNow() {
            return new MyFailingTask();
        }
    }

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
                logType: `Task`,
                status: `passed`,
                description: `Logan attempts to`,
                activityNodes: []
            };

            const expectedStructuredLog = `[START] - Logan attempts to`;
            const expectedStructuredHtmlLog = `<ul id="ActivityLog"><li><span class="task passed"><span class="logMessage"><span class="activityName">[START]</span> - <span class="activityDescription">Logan attempts to</span></span></span><ul class="nested"></ul></li></ul>`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`  `))
                .toEqual(expectedStructuredLog);
            expect(logan.activityLog.getStructuredLog(`  `, `base64`))
                .toEqual(new Buffer(expectedStructuredLog).toString(`base64`));

            const htmlLog = logan.activityLog.getStructuredHtmlLog();
            expect(htmlLog).toContain(expectEmbeddedStyle);         // eslint-disable-line @typescript-eslint/no-use-before-define
            expect(htmlLog).toContain(functionHtml);                // eslint-disable-line @typescript-eslint/no-use-before-define
            expect(htmlLog).toContain(expectedStructuredHtmlLog);   // eslint-disable-line @typescript-eslint/no-use-before-define
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
                logType: `Task`,
                status: `passed`,
                description: `Logan attempts to`,
                activityNodes: [
                    {
                        name: `SkipTask`,
                        logType: `Interaction`,
                        status: `passed`,
                        description: `skip task 'MyNewTask' with reason: 'no data was passed'`,
                        activityNodes: []
                    }
                ]
            };
            const expectedStructuredLog =
                `[START] - Logan attempts to
  [SkipTask] - skip task 'MyNewTask' with reason: 'no data was passed'`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`  `)).toEqual(expectedStructuredLog);
            expect(logan.activityLog.getStructuredLog(`  `, `base64`))
                .toEqual(new Buffer(expectedStructuredLog).toString(`base64`))

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
                logType: `Task`,
                status: `passed`,
                description: `Logan attempts to`,
                activityNodes: [
                    {
                        name: `MyNewTask`,
                        logType: `Task`,
                        status: `passed`,
                        description: `execute the empty task to test the log activity`,
                        activityNodes: []
                    }
                ]
            };

            const expectedStructuredLog =
                `[START] - Logan attempts to
  [MyNewTask] - execute the empty task to test the log activity`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`  `)).toEqual(expectedStructuredLog);
            expect(logan.activityLog.getStructuredLog(`  `, `base64`))
                .toEqual(new Buffer(expectedStructuredLog).toString(`base64`))

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
                logType: `Task`,
                status: `passed`,
                description: `Logan attempts to`,
                activityNodes: [
                    {
                        name: `MyNewTask`,
                        logType: `Task`,
                        status: `passed`,
                        description: `execute the empty task to test the log activity`,
                        activityNodes: []
                    },
                    {
                        name: `SkipTask`,
                        logType: `Interaction`,
                        status: `passed`,
                        description: `skip task 'MyNewTask' with reason: 'no data was passed'`,
                        activityNodes: []
                    }
                ]
            };

            const expectedStructuredLog =
                `[START] - Logan attempts to
  [MyNewTask] - execute the empty task to test the log activity
  [SkipTask] - skip task 'MyNewTask' with reason: 'no data was passed'`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`  `)).toEqual(expectedStructuredLog);
            expect(logan.activityLog.getStructuredLog(`  `, `base64`))
                .toEqual(new Buffer(expectedStructuredLog).toString(`base64`))

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
                logType: `Task`,
                status: `passed`,
                description: `Logan attempts to`,
                activityNodes: [
                    {
                        name: `MyFirstTask`,
                        logType: `Task`,
                        status: `passed`,
                        description: `execute the first task`,
                        activityNodes: [{
                            name: `SkipTask`,
                            logType: `Interaction`,
                            status: `passed`,
                            description: `skip task 'MyNewTask' with reason: 'no data was passed'`,
                            activityNodes: []
                        }]
                    },
                    {
                        name: `SkipTask`,
                        logType: `Interaction`,
                        status: `passed`,
                        description: `skip task 'MyNewTask' with reason: 'no data was passed'`,
                        activityNodes: []
                    }
                ]
            };

            const expectedStructuredLog =
                `[START] - Logan attempts to
  [MyFirstTask] - execute the first task
    [SkipTask] - skip task 'MyNewTask' with reason: 'no data was passed'
  [SkipTask] - skip task 'MyNewTask' with reason: 'no data was passed'`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`  `)).toEqual(expectedStructuredLog);
            expect(logan.activityLog.getStructuredLog(`  `, `base64`))
                .toEqual(new Buffer(expectedStructuredLog).toString(`base64`))
        });

        it(`should set the status failed when the task fails 
        - (test case id: 65339721-a153-4b5d-945f-873a563847c1)`, async (): Promise<void> => {
            const logan = Actor.named(`Logan`);

            await logan.attemptsTo(
                Sleep.for(1),
                MyFailingTask.startsNow()
            ).catch((e: Error) => {
                // catch the failing Task
                return;
            });

            const expectedLogTree: ActivityLogNode = {

                description: `Logan attempts to`,
                logType: `Task`,
                name: `START`,
                status: `failed`,
                activityNodes: [{
                    description: `stop all actions for '1' ms`,
                    logType: `Interaction`,
                    name: `Sleep`,
                    status: `passed`,
                    activityNodes: [],
                },{

                    description: `execute a failing Task`,
                    logType: `Task`,
                    name: `MyFailingTask`,
                    status: `failed`,
                    activityNodes: [],
                }],
            };

            const expectedStructuredLog = `[START] - Logan attempts to
    [Sleep] - stop all actions for '1' ms
    [MyFailingTask] - execute a failing Task`;

            const expectedStructuredHtmlLog = `<ul id="ActivityLog"><li><span class="task failed"><span class="logMessage"><span class="activityName">[START]</span> - <span class="activityDescription">Logan attempts to</span></span></span><ul class="nested"><li class="interaction passed"><span class="logMessage"><span class="activityName">[Sleep]</span> - <span class="activityDescription">stop all actions for '1' ms</span></span></li><li><span class="task failed"><span class="logMessage"><span class="activityName">[MyFailingTask]</span> - <span class="activityDescription">execute a failing Task</span></span></span><ul class="nested"></ul></li></ul></li></ul>`;

            const logTree = logan.activityLog.getLogTree();
            const structuredLog = logan.activityLog.getStructuredLog();
            const structuredHtmlLog = logan.activityLog.getStructuredHtmlLog();

            expect(logTree).toEqual(expectedLogTree);
            expect(structuredLog).toEqual(expectedStructuredLog);
            expect(structuredHtmlLog).toContain(expectedStructuredHtmlLog);
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
                logType: `Task`,
                status: `passed`,
                description: `Logan attempts to`,
                activityNodes: [{
                    name: `Sleep`,
                    logType: `Interaction`,
                    status: `passed`,
                    description: `stop all actions for '1' ms`,
                    activityNodes: []
                }]
            };

            const expectedStructuredLog =
                `[START] - Logan attempts to
....[Sleep] - stop all actions for '1' ms`;

            expect(logan.activityLog.getLogTree()).toEqual(expected, `log node tree does not match`);

            // expect(logan.activityLog.getStructuredLog(`....`)).toEqual(expectedStructuredLog, `structured log does not match`);
            //
            // expect(logan.activityLog.getStructuredLog(`....`, `base64`))
            //     .toEqual(new Buffer(expectedStructuredLog).toString(`base64`))
        });

        it(`should create a hierarchical sleep activity for the actor 
        - (test case id: 430b2281-7d06-471e-9e75-a2236f0d24eb)`, async (): Promise<void> => {
            const logan = Actor.named(`Logan`);

            await logan.attemptsTo(
                Sleep.for(1).because(`Sleep should be executed before MySleepTask`),
                MySleepTask.startsNow()
            );

            const expected: ActivityLogNode = {
                name: `START`,
                logType: `Task`,
                status: `passed`,
                description: `Logan attempts to`,
                activityNodes: [
                    {
                        name: `Sleep`,
                        logType: `Interaction`,
                        status: `passed`,
                        description: `stop all actions for '1' ms because Sleep should be executed before MySleepTask`,
                        activityNodes: []
                    },
                    {
                        name: `MySleepTask`,
                        logType: `Task`,
                        status: `passed`,
                        description: `execute the sleep task`,
                        activityNodes: [
                            {
                                name: `Sleep`,
                                logType: `Interaction`,
                                status: `passed`,
                                description: `stop all actions for '1' ms`,
                                activityNodes: []
                            }
                        ]
                    }]
            };

            const expectedStructuredLog =
                `[START] - Logan attempts to
....[Sleep] - stop all actions for '1' ms because Sleep should be executed before MySleepTask
....[MySleepTask] - execute the sleep task
........[Sleep] - stop all actions for '1' ms`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`....`)).toEqual(expectedStructuredLog);
            expect(logan.activityLog.getStructuredLog(`....`, `base64`))
                .toEqual(new Buffer(expectedStructuredLog).toString(`base64`))
        });
    });

});

const styleFile = fs.readFileSync(`${__dirname}/../../../../res/styles/ActivityLog.css`);

const expectEmbeddedStyle = `
<style>
${styleFile.toString()}
</style>`;

const functionHtml = `<script>
var toggler = document.getElementsByClassName("task");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("task-open");
  });
}
</script>`;