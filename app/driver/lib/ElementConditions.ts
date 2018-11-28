import {WebElementFinder} from "../interface/WebElements";

export interface UntilElementCondition {
    readonly checker: (element: WebElementFinder) => Promise<boolean>;
    forAsLongAs(timeout: number): UntilElementCondition;
    readonly timeout: number;
    readonly conditionHelpText: string;
}

export class UntilElement implements UntilElementCondition{
    private _timeout: number = 5000;

    public static isVisible() {
        const fn = (element: WebElementFinder) => element.isVisible();
        const condition = "Waiting for visibility of ";
        return new UntilElement(fn, condition)
    }

    constructor(
        public readonly checker: (element: WebElementFinder) => Promise<boolean> = (element: WebElementFinder) => Promise.resolve(true),
        private readonly _conditionHelpText: string = "") {
    }

    forAsLongAs(timeout: number): UntilElementCondition {
        this._timeout = timeout;
        return this;
    }

    get timeout() {
        return this._timeout;
    }

    get conditionHelpText() {
        return this._conditionHelpText
    }
}