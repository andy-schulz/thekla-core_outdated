import {AnswersQuestions, PerformsTask, UsesAbilities} from "../../Actor";

/**
 *       Task = a Workflow composed of Tasks or Interactions or both
 *     /
 * Activity - Oracle = an entity that answers questions
 *    \
 *     Interactions = Low Level actions made available by the Ability
 */
export interface Activity<PT,RT> {
    performAs(actor: PerformsTask | UsesAbilities | AnswersQuestions, result: PT): Promise<RT>;
}

export interface Oracle<PT,RT> extends Activity<PT,RT>{
    performAs(actor: AnswersQuestions, result: PT): Promise<RT>;
}

export interface Interaction<PT,RT> extends Activity<PT,RT>{
    performAs(actor: UsesAbilities, result: PT): Promise<RT>;
    toString(): string;
}

export abstract class Task<PT,RT> implements Activity<PT,RT> {
    abstract performAs(actor: PerformsTask, result: PT): Promise<RT>;
}

export class BasicTaskPerfomer<P> implements Activity<P,P> {
    public performAs(actor: PerformsTask, result: P): Promise<P> {
        return Promise.resolve(result);
    }
}