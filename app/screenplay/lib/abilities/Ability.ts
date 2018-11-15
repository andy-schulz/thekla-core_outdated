import {UsesAbilities} from "../../Actor";

/**
 * AbilityClass type to pass an ability class as parameter
 */
export interface AbilityClass {
    new (...args: any[]): Ability;
}

export interface Ability {
    // as(actor: UsesAbilities): Ability;
}