import {Interaction}                from "../actions/Activities";
import {stepDetails, UsesAbilities} from "../../..";

export class SkipTask implements Interaction<void, void> {
    private myTaskName = ``;
    private myMessage = ``;

    @stepDetails<UsesAbilities,void,void>(`skip task '<<taskName>>' with reason: '<<message>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
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
    }
}