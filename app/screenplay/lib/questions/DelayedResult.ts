import {Question} from "./Question";

export class DelayedResult implements Question<void,string> {
    private timeout = 1000;
    private delayedValue: string = `Default value. Timeout of ${this.timeout} ms not reached. Second value not set yet.`;
    private called = false;
    private setValue = (): string => this.delayedValue = this.value;

    public answeredBy(): Promise<string> {
        if(!this.called)
            setTimeout(this.setValue, this.timeout);
        this.called = true;
        return Promise.resolve(this.delayedValue);
    };

    public static returnsValue(value: string): DelayedResult {
        return new DelayedResult(value)
    };


    public after(timeInMs: number): DelayedResult {
        this.timeout = timeInMs;
        this.delayedValue = `Default value. Timeout of ${this.timeout} ms not reached. Second value not set yet.`;

        if(timeInMs <= 0)
            this.delayedValue = this.value;

        return this;
    }


    private constructor(private value: string) {
    };

    public toString(): string {
        return `delayed result with timeout of '${this.timeout} ms'`
    }
}