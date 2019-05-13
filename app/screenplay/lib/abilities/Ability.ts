// import {UsesAbilities} from "../../Actor";

/**
 * AbilityClass type to pass an ability class as parameter
 */
export interface AbilityClass {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]): Ability;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Ability {
    // right now I cant declare static methods on interfaces
    // as(actor: UsesAbilities): Ability;
}