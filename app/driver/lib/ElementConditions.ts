export interface UntilElementCondition {
    visible(): UntilElementCondition;
    forAsLongAs(timeout: number): UntilElementCondition;
    readonly negate: LogicFunction<boolean>;
    readonly waiter: ElementCondition;
    readonly timeout: number;
    readonly conditionHelpText: string;
}

abstract class  ElementCondition {
    public abstract helpText: string;
}

export class VisibilityCheck extends ElementCondition{
    constructor(
        public helpText = "visible"
    ) {super()}
}

export class EnabledCheck extends ElementCondition{
    constructor(
        public helpText = "enabled"
    ) {super()}
}

type LogicFunction<T> = (param: T) => T

export class UntilElement implements UntilElementCondition{
    private _timeout: number = 5000;
    public waiter: ElementCondition;

    private static readonly id: LogicFunction<boolean> = (result: boolean) => result;
    private static readonly negate: LogicFunction<boolean> = (result: boolean) => !result;

    public static get is():UntilElement {
        return new UntilElement(UntilElement.id)
    }

    public static get isNot(): UntilElement {
        return new UntilElement(UntilElement.negate)
    }

    public visible(): UntilElementCondition {
        this.waiter = new VisibilityCheck();
        return this;
    }

    public enabled(): UntilElementCondition {
        this.waiter = new EnabledCheck();
        return this;
    }

    constructor(public negate: LogicFunction<boolean>) {
    }

    forAsLongAs(timeout: number): UntilElementCondition {
        this._timeout = timeout;
        return this;
    }

    get timeout() {
        return this._timeout;
    }

    get conditionHelpText() {
        return `${this.negate(true) ? "is" : "is not"} ${this.waiter.helpText}`
    }
}