import {ActivityLogNode}     from "../../../packages/ActivityLog/ActivityLogEntry";
import {Actor, PerformsTask} from "../../../screenplay/Actor";
import {Task}                from "../../../screenplay/lib/actions/Activities";
import {Sleep}               from "../../../screenplay/lib/actions/Sleep";
import {step}                from "../../../screenplay/lib/decorators/step_decorators";
import {SkipTask}            from "../../../screenplay/lib/tasks/SkipTask";

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

        sit(`should create only the activity log root node when no activities are passed
        - (test case id: 3b452b2b-d9eb-4d23-b5d0-23eb42703755)`, async (): Promise<void> => {
            const logan = Actor.named(`Logan`);

            await logan.attemptsTo(
            );

            const expected: ActivityLogNode = {
                name: `START`,
                logType: `Task`,
                description: `Logan starts Testing`,
                activityNodes: []
            };

            const expectedStructuredLog = `[START] - Logan starts Testing`;
            const expectedStructuredHtmlLog = `<ul id="ActivityLog"><li><span class="task"><span class="logMessage"><span class="activityName">[START]</span> - <span class="activityDescription">Logan starts Testing</span></span></span><ul class="nested"></ul></li></ul>`

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`  `))
                .toEqual(expectedStructuredLog);
            expect(logan.activityLog.getStructuredLog(`  `, `base64`))
                .toEqual(new Buffer(expectedStructuredLog).toString(`base64`));

            const htmlLog = logan.activityLog.getStructuredHtmlLog();
            console.log(htmlLog);
            expect(htmlLog).toContain(expectStyleHtml); // eslint-disable-line @typescript-eslint/no-use-before-define
            expect(htmlLog).toContain(functionHtml); // eslint-disable-line @typescript-eslint/no-use-before-define
            expect(htmlLog).toContain(expectedStructuredHtmlLog); // eslint-disable-line @typescript-eslint/no-use-before-define
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
                description: `Logan starts Testing`,
                activityNodes: [
                    {
                        name: `SkipTask`,
                        logType: `Task`,
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
                description: `Logan starts Testing`,
                activityNodes: [
                    {
                        name: `MyNewTask`,
                        logType: `Task`,
                        description: `Logan attempts to execute the empty task to test the log activity`,
                        activityNodes: []
                    }
                ]
            };

            const expectedStructuredLog =
                `[START] - Logan starts Testing
  [MyNewTask] - Logan attempts to execute the empty task to test the log activity`;

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
                description: `Logan starts Testing`,
                activityNodes: [
                    {
                        name: `MyNewTask`,
                        logType: `Task`,
                        description: `Logan attempts to execute the empty task to test the log activity`,
                        activityNodes: []
                    },
                    {
                        name: `SkipTask`,
                        logType: `Task`,
                        description: `Logan skips the task 'MyNewTask' with reason: 'no data was passed'`,
                        activityNodes: []
                    }
                ]
            };

            const expectedStructuredLog =
                `[START] - Logan starts Testing
  [MyNewTask] - Logan attempts to execute the empty task to test the log activity
  [SkipTask] - Logan skips the task 'MyNewTask' with reason: 'no data was passed'`;

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
                description: `Logan starts Testing`,
                activityNodes: [
                    {
                        name: `MyFirstTask`,
                        logType: `Task`,
                        description: `Logan attempts to execute the first task`,
                        activityNodes: [{
                            name: `SkipTask`,
                            logType: `Task`,
                            description: `Logan skips the task 'MyNewTask' with reason: 'no data was passed'`,
                            activityNodes: []
                        }]
                    },
                    {
                        name: `SkipTask`,
                        logType: `Task`,
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
            expect(logan.activityLog.getStructuredLog(`  `, `base64`))
                .toEqual(new Buffer(expectedStructuredLog).toString(`base64`))
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
                description: `Logan starts Testing`,
                activityNodes: [{
                    name: `Sleep`,
                    logType: `Interaction`,
                    description: `Logan attempts to stop all actions for '1' ms`,
                    activityNodes: []
                }]
            };

            const expectedStructuredLog =
                `[START] - Logan starts Testing
....[Sleep] - Logan attempts to stop all actions for '1' ms`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);

            expect(logan.activityLog.getStructuredLog(`....`)).toEqual(expectedStructuredLog);

            expect(logan.activityLog.getStructuredLog(`....`, `base64`))
                .toEqual(new Buffer(expectedStructuredLog).toString(`base64`))
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
                logType: `Task`,
                description: `Logan starts Testing`,
                activityNodes: [
                    {
                        name: `Sleep`,
                        logType: `Interaction`,
                        description: `Logan attempts to stop all actions for '1' ms`,
                        activityNodes: []
                    },
                    {
                        name: `MySleepTask`,
                        logType: `Task`,
                        description: `Logan attempts to execute the sleep task`,
                        activityNodes: [
                            {
                                name: `Sleep`,
                                logType: `Interaction`,
                                description: `Logan attempts to stop all actions for '1' ms`,
                                activityNodes: []
                            }
                        ]
                    }]
            };

            const expectedStructuredLog =
                `[START] - Logan starts Testing
....[Sleep] - Logan attempts to stop all actions for '1' ms
....[MySleepTask] - Logan attempts to execute the sleep task
........[Sleep] - Logan attempts to stop all actions for '1' ms`;

            expect(logan.activityLog.getLogTree()).toEqual(expected);
            expect(logan.activityLog.getStructuredLog(`....`)).toEqual(expectedStructuredLog);
            expect(logan.activityLog.getStructuredLog(`....`, `base64`))
                .toEqual(new Buffer(expectedStructuredLog).toString(`base64`))
        });
    });

});

const expectStyleHtml = `<style>
ul, #ActivityLog {
  list-style-type: none;
}

#ActivityLog {
  margin: 0;
  padding: 0;
}

.task {
  cursor: pointer;
  -webkit-user-select: none; /* Safari 3.1+ */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none;
}

.task::before {
  /*content: "\\25B6"; */
  content: "\\25B6";
  color: black;
  display: inline-block;
  margin-right: 6px;
}

.task-open::before {
  -ms-transform: rotate(90deg); /* IE 9 */
  -webkit-transform: rotate(90deg); /* Safari */'
  transform: rotate(90deg);  
}

.nested {
  display: none;
}

.active {
  display: block;
}

.interaction::before {
  content: "\\25B7";
  margin-right: 6px;
}

.logMessage.fail {
    color: red;
}

.activityName {
  color: #ff0bb1;
}

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