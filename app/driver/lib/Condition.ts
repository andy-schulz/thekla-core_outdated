export class Condition {
    public constructor(
        public fn: () => Promise<boolean>,
        public description: string = `Waiting for Element`) {
    }

    public check(): Promise<boolean> {
        return this.fn();
    }
}

export interface ConditionElement extends Function {
    (fn: () => Promise<boolean>): Condition;
    not: (fn: () => Promise<boolean>) => Condition;
}

function createConditionHelper(): ConditionElement {
    const until = ((fn: () => Promise<boolean>) => {
        return new Condition(fn)
    }) as ConditionElement;

    until.not = (fn: () => Promise<boolean>) => {
        let invertFunc = (): Promise<boolean> => fn().then((state): boolean => !state);
        return new Condition(invertFunc);
    };
    return until;
}

export const until = createConditionHelper();