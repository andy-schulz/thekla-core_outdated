export interface UntilElementCondition {
    forAsLongAs(timeout: number): UntilElementCondition;
    readonly waiter: ElementCondition;
    readonly timeout: number;
    readonly conditionHelpText: string;
}

abstract class  ElementCondition {
    public abstract helpText: string;
}

export class VisibilityCheck extends ElementCondition{
    constructor(
        public helpText = "Waiting for visibility of "
    ) {super()}
}

export class UntilElement implements UntilElementCondition{
    private _timeout: number = 5000;

    public static isVisible() {
        return new UntilElement(new VisibilityCheck())
    }

    constructor(
        public  waiter: ElementCondition) {
    }

    forAsLongAs(timeout: number): UntilElementCondition {
        this._timeout = timeout;
        return this;
    }

    get timeout() {
        return this._timeout;
    }

    get conditionHelpText() {
        return this.waiter.helpText
    }
}