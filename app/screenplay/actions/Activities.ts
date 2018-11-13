import {PerformsTask, UsesAbilities} from "../Actor";

/**
 *       Task = a Workflow composed of Tasks or Interactions or both
 *     /
 * Activity
 *    \
 *     Interactions = Low Level Tasks on the Browser
 */
export interface Activity {
    performAs(actor: PerformsTask | UsesAbilities): Promise<void>;
}

export interface Interaction {
    performAs(actor: UsesAbilities): Promise<void>;
}

export abstract class Task implements Activity {
    abstract performAs(actor: PerformsTask | UsesAbilities): Promise<void>;
}