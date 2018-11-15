import {AnswersQuestions, PerformsTask, UsesAbilities} from "../Actor";

/**
 *       Task = a Workflow composed of Tasks or Interactions or both
 *     /
 * Activity
 *    \
 *     Interactions = Low Level Tasks on the Browser
 */
export interface Activity {
    performAs(actor: PerformsTask | UsesAbilities | AnswersQuestions): Promise<void>;
}

export interface Matcher extends Activity{
    performAs(actor: AnswersQuestions): Promise<void>;
}

export interface Interaction extends Activity{
    performAs(actor: UsesAbilities): Promise<void>;
}

export abstract class Task implements Activity {
    abstract performAs(actor: PerformsTask): Promise<void>;
}