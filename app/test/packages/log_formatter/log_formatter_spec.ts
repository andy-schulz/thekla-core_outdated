import {ActivityLogNode} from "../../../packages/ActivityLog/ActivityLogEntry";
import {
    encloseInTag,
    encodeLog,
    formatLogWithPrefix,
    formatLogWithHtmlTags
}                        from "../../../packages/ActivityLog/format_log";

describe(`Using the log formater`, (): void => {

    describe(`with a single log node`, (): void => {

        it(`should create a single log message line 
        - (test case id: c5228ece-d1aa-4e0a-8f4b-696009fc786c)`, (): void => {
            const log: ActivityLogNode = {
                name: `1`,
                logType: `Task`,
                status: `running`,
                description: `A`,
                activityNodes: [],
            };

            expect(formatLogWithPrefix(``)(0)(log)).toEqual(`[1] - A`);
            expect(formatLogWithPrefix(`\t`)(1)(log)).toEqual(`\t[1] - A`);
            expect(formatLogWithPrefix(`\t`)(2)(log)).toEqual(`\t\t[1] - A`);
        });

        it(`should create a single log message as html
        - (test case id: e6971909-c24e-4848-b800-1f6edd490f5c)`, (): void => {
            const interaction: ActivityLogNode = {
                name: `1`,
                logType: `Interaction`,
                status: `running`,
                description: `A`,
                activityNodes: [],
            };

            const task: ActivityLogNode = {
                name: `1`,
                logType: `Task`,
                status: `running`,
                description: `A`,
                activityNodes: [],
            };

            const interactionHtml = formatLogWithHtmlTags(interaction);
            const taskHtml = formatLogWithHtmlTags(task);
            expect(interactionHtml).toEqual(`<ul id="ActivityLog"><li class="interaction running"><span class="logMessage"><span class="activityName">[1]</span> - <span class="activityDescription">A</span></span></li></ul>`);
            expect(taskHtml).toEqual(`<ul id="ActivityLog"><li><span class="task running"><span class="logMessage"><span class="activityName">[1]</span> - <span class="activityDescription">A</span></span></span><ul class="nested"></ul></li></ul>`);
        });
    });

    describe(`with a hierarchical log tree`, (): void => {

        it(`should create a hierarchical log tree with just tasks
        - (test case id: c5228ece-d1aa-4e0a-8f4b-696009fc786c)`, (): void => {
            const log: ActivityLogNode = {
                name: `1`,
                logType: `Task`,
                status: `running`,
                description: `A`,
                activityNodes: [
                    {
                        name: `2`,
                        logType: `Task`,
                        status: `running`,
                        description: `B`,
                        activityNodes: [
                            {
                                name: `3`,
                                logType: `Task`,
                                status: `running`,
                                description: `C`,
                                activityNodes: [
                                    {
                                        name: `4`,
                                        logType: `Task`,
                                        status: `running`,
                                        description: `D`,
                                        activityNodes: [],
                                    }
                                ],
                            }
                        ],
                    }
                ],
            };

            expect(formatLogWithPrefix(``)(0)(log)).toEqual(`[1] - A\n[2] - B\n[3] - C\n[4] - D`);
            expect(formatLogWithPrefix(`\t`)(1)(log)).toEqual(`\t[1] - A\n\t\t[2] - B\n\t\t\t[3] - C\n\t\t\t\t[4] - D`);
            expect(formatLogWithPrefix(`\t`)(2)(log)).toEqual(`\t\t[1] - A\n\t\t\t[2] - B\n\t\t\t\t[3] - C\n\t\t\t\t\t[4] - D`);
        });

        it(`should create a hierarchical html log tree with just tasks
        - (test case id: 2ad81461-a991-4d02-8606-d6a1a68c27a4)`, (): void => {
            const taskTree: ActivityLogNode = {
                name: `1`,
                logType: `Task`,
                status: `running`,
                description: `A`,
                activityNodes: [
                    {
                        name: `2`,
                        logType: `Task`,
                        status: `running`,
                        description: `B`,
                        activityNodes: [
                            {
                                name: `3`,
                                logType: `Task`,
                                status: `running`,
                                description: `C`,
                                activityNodes: [
                                    {
                                        name: `4`,
                                        logType: `Task`,
                                        status: `running`,
                                        description: `D`,
                                        activityNodes: [],
                                    }
                                ],
                            }
                        ],
                    }
                ],
            };

            const taskLog = formatLogWithHtmlTags(taskTree);
            expect(taskLog).toEqual(`<ul id="ActivityLog"><li><span class="task running"><span class="logMessage"><span class="activityName">[1]</span> - <span class="activityDescription">A</span></span></span><ul class="nested"><li><span class="task running"><span class="logMessage"><span class="activityName">[2]</span> - <span class="activityDescription">B</span></span></span><ul class="nested"><li><span class="task running"><span class="logMessage"><span class="activityName">[3]</span> - <span class="activityDescription">C</span></span></span><ul class="nested"><li><span class="task running"><span class="logMessage"><span class="activityName">[4]</span> - <span class="activityDescription">D</span></span></span><ul class="nested"></ul></li></ul></li></ul></li></ul></li></ul>`)
        });

        it(`should create a hierarchical log html tree with tasks and interactions
        - (test case id: 82b7d61f-b973-4247-8498-89bbe1253d78)`, (): void => {
            const log: ActivityLogNode = {
                name: `1`,
                logType: `Task`,
                status: `running`,
                description: `A`,
                activityNodes: [
                    {
                        name: `2`,
                        logType: `Interaction`,
                        status: `running`,
                        description: `B`,
                        activityNodes: [],
                    },
                    {
                        name: `3`,
                        logType: `Task`,
                        status: `running`,
                        description: `C`,
                        activityNodes: [
                            {
                                name: `4`,
                                logType: `Task`,
                                status: `running`,
                                description: `D`,
                                activityNodes: [],
                            }
                        ],
                    }
                ],
            };

            const taskAndInteractionHtml = formatLogWithHtmlTags(log);
            expect(taskAndInteractionHtml).toEqual(`<ul id="ActivityLog"><li><span class="task running"><span class="logMessage"><span class="activityName">[1]</span> - <span class="activityDescription">A</span></span></span><ul class="nested"><li class="interaction running"><span class="logMessage"><span class="activityName">[2]</span> - <span class="activityDescription">B</span></span></li><li><span class="task running"><span class="logMessage"><span class="activityName">[3]</span> - <span class="activityDescription">C</span></span></span><ul class="nested"><li><span class="task running"><span class="logMessage"><span class="activityName">[4]</span> - <span class="activityDescription">D</span></span></span><ul class="nested"></ul></li></ul></li></ul></li></ul>`)
        });
    });

    describe(`to encode a string`, (): void => {

        const testString = `MyString`;

        it(`should return a base64 string when the encoding is set 
        - (test case id: bdad05f3-4e3a-468b-af31-69f1ad395abf)`, (): void => {
            expect(encodeLog(`base64`)(`MyString`)).toEqual(new Buffer(testString).toString(`base64`))
        });

        it(`should return the string if no encoding is set 
        - (test case id: 29b4c4ca-511e-4d49-ada3-cc94152da617)`, (): void => {
            expect(encodeLog(``)(testString)).toEqual(testString);
        });

        it(`should return the string if no encoding is set (undefined)
        - (test case id: 29b4c4ca-511e-4d49-ada3-cc94152da617)`, (): void => {
            expect(encodeLog()(testString)).toEqual(testString);
        });
    });

    describe(`to format a string as html`, (): void => {
        it(`should return the string enclosed in a tag and inline style 
        - (test case id: 52763d82-90e1-433c-9dd2-ec1b3cf54fe2)`, (): void => {
            const textString = `MyText`;
            const tag = `span`;
            const style = `color: red;`;

            const expected = `<span style="color: red;">MyText</span>`;
            expect(encloseInTag(textString, tag, style)).toEqual(expected)
        });

        it(`should return the string enclosed in a tag and no inline style
        - (test case id: c34b7109-ffdd-458e-8662-41fa0a798f92)`, (): void => {
            const textString = `MyText`;
            const tag = `span`;

            const expected = `<span>MyText</span>`;
            expect(encloseInTag(textString, tag)).toEqual(expected)
        });

        it(`should return an empty tag
        - (test case id: 3be9e8be-7c20-4552-9008-18d4df3b3b4f)`, (): void => {
            const textString = ``;
            const tag = `span`;

            const expected = `<span></span>`;
            expect(encloseInTag(textString, tag)).toEqual(expected)
        });

        it(`should return an empty tag with a style
        - (test case id: 3be9e8be-7c20-4552-9008-18d4df3b3b4f)`, (): void => {
            const textString = ``;
            const tag = `span`;
            const style = `color: red;`;

            const expected = `<span style="color: red;"></span>`;
            expect(encloseInTag(textString, tag, style)).toEqual(expected)
        });
    });
});