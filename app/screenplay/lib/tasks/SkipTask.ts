import {Task}         from "../actions/Activities";
import {PerformsTask} from "../../..";
import {skip}     from "../decorators/step_decorators";

export class SkipTask extends Task<void, void> {
    private myTaskName = ``;
    private myMessage = ``;


    @skip<PerformsTask,void,void>(`the task '<<taskName>>' with reason: '<<message>>'`)
    public performAs(actor: PerformsTask): Promise<void> {
        return Promise.resolve();
    }

    public set taskName(taskName: string) {
        this.myTaskName = taskName
    }

    public get taskName(): string {
        return this.myTaskName;
    }

    public set message(message: string) {
        this.myMessage = message
    }

    public get message(): string {
        return this.myMessage;
    }

    public static called(taskName: string): SkipTask {
        const skip = new SkipTask(taskName);
        skip.taskName = taskName;
        return skip;
    }

    public withMessage(message: string): SkipTask {
        this.message  = message;
        return this;
    }

    private constructor(...args: any[]) {
        super();
    }
}