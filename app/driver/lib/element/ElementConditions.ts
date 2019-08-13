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
    public constructor(
        public helpText = `visible`
    ) {super()}
}

export class EnabledCheck extends ElementCondition{
    public constructor(
        public helpText = `enabled`
    ) {super()}
}

type LogicFunction<T> = (param: T) => T

export class UntilElement implements UntilElementCondition{
    private _timeout: number = 5000;
    public waiter: ElementCondition;

    private static readonly id: LogicFunction<boolean> = (result: boolean): boolean => result;
    private static readonly negate: LogicFunction<boolean> = (result: boolean): boolean => !result;

    public static get is(): UntilElement {
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

    private constructor(public negate: LogicFunction<boolean>) {
    }

    public forAsLongAs(timeout: number): UntilElementCondition {
        this._timeout = timeout;
        return this;
    }

    public get timeout(): number {
        return this._timeout;
    }

    public get conditionHelpText(): string {
        return `${this.negate(true) ? `is` : `is not`} ${this.waiter.helpText}`
    }

    public toString(): string {
        const conditionType = (waiter: ElementCondition): string => {
            if(waiter.constructor.name === `VisibilityCheck`)   return `visible`;
            if(waiter.constructor.name === `EnabledCheck`)      return `enabled`;
            throw new Error(`ElementCondition named: '${waiter.constructor.name}' not implemented yet. ${(new Error).stack}`)
        };

        return `condition until element is${this.negate(true) ? `` : ` not`} ${conditionType(this.waiter)}`
    }
}