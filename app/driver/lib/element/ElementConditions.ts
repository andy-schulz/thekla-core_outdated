import {SppElement}       from "../../../screenplay/web/SppWebElements";
import {WebElementFinder} from "../../interface/WebElements";

export interface UntilElementCondition {
    visible(): UntilElementCondition;
    forAsLongAs(timeout: number): UntilElementCondition;
    readonly modifierFunc: LogicFunction<boolean>;
    readonly waiter: ElementCondition;
    readonly timeout: number;
    readonly conditionHelpText: string;
}

abstract class  ElementCondition {
    public abstract helpText: string;
    public elementText: string = ``;
    abstract isFulfilledFor(element: WebElementFinder): () => Promise<boolean>;
}

export class VisibilityCheck extends ElementCondition{
    public constructor(
        public modifierFunc: (result: boolean) => boolean,
        public helpText = `visible`
    ) {super()}

    public isFulfilledFor(element: WebElementFinder): () => Promise<boolean> {
        this.elementText = `Waiting until element called '${element.description}'`;
        return () => {
            return element.isVisible().then(this.modifierFunc)
        };
    }
}

export class EnabledCheck extends ElementCondition{
    public constructor(
        public modifierFunc: (result: boolean) => boolean,
        public helpText = `enabled`
    ) {super()}

    public isFulfilledFor(element: WebElementFinder): () => Promise<boolean> {
        const helpText = `${element.description}`;
        return () => {
            return element.isEnabled().then(this.modifierFunc);
        };
    }
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
        this.waiter = new VisibilityCheck(this.modifierFunc);
        return this;
    }

    public enabled(): UntilElementCondition {
        this.waiter = new EnabledCheck(this.modifierFunc);
        return this;
    }

    private constructor(public modifierFunc: LogicFunction<boolean>) {
    }

    public forAsLongAs(timeout: number): UntilElementCondition {
        this._timeout = timeout;
        return this;
    }

    public get timeout(): number {
        return this._timeout;
    }

    public get conditionHelpText(): string {
        return `${this.waiter.elementText} ${this.modifierFunc(true) ? `is` : `is not`} ${this.waiter.helpText}`
    }

    public toString(): string {
        const conditionType = (waiter: ElementCondition): string => {
            if(waiter.constructor.name === `VisibilityCheck`)   return `visible`;
            if(waiter.constructor.name === `EnabledCheck`)      return `enabled`;
            throw new Error(`ElementCondition named: '${waiter.constructor.name}' not implemented yet. ${(new Error).stack}`)
        };

        return `condition until element is${this.modifierFunc(true) ? `` : ` not`} ${conditionType(this.waiter)}`
    }
}