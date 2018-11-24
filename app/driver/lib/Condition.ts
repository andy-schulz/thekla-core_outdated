export class Condition {
    constructor(
        public fn: () => Promise<boolean>,
        public description: string = "Waiting for Element") {
    }

    check(): Promise<boolean> {
        return this.fn();
    }
}

export interface ConditionElement extends Function {
    (fn :() => Promise<boolean>): Condition;
    not: (fn :() => Promise<boolean>) => Condition;
}

function createConditionHelper() {
    const until = ((fn :() => Promise<boolean>) => {
        return new Condition(fn)
    }) as ConditionElement;

    until.not = (fn :() => Promise<boolean>) => {
        let invertFunc = () => fn().then(state => !state);
        return new Condition(invertFunc);
    };
    return until;
}

export const until = createConditionHelper();