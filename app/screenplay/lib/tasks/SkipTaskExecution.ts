import {Task} from "../actions/Activities";

export class SkipTaskExecution extends Task<void, void> {
    public performAs(/*actor: PerformsTask*/): Promise<void> {
        return Promise.resolve();
    }

    public static asNoDataWereFound(message: string) {
        return new SkipTaskExecution(message);
    }

    private constructor(private message: string) {
        super();
    }
}