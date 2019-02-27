/**
 * Actor implements the following relationships
 *
 * QUESTIONS
 *   ↑
 * answers
 *   |
 * ACTOR -- performs --> TASK
 *   |
 *  uses
 *   ↓
 * ABILITIES
 *
 * each relationship has its own interface
 */
import {Ability, AbilityClass} from "./lib/abilities/Ability";
import {Activity}              from "./lib/actions/Activities";
import {NoSuchAbilityError}    from "./errors/NoSuchAbilityError";
import {Question}              from "./lib/matcher/Question";


export interface AnswersQuestions {
    toAnswer<T>(question: Question<T>): Promise<T>;
}

export interface PerformsTask {
    attemptsTo(...activities: Activity[]): Promise<void>;
}

export interface UsesAbilities {
    // abilityTo(Ability: AbilityClass): Ability;
    withAbilityTo(Ability: AbilityClass): Ability;
    can(ability: Ability): void;
}

export class Actor implements AnswersQuestions, PerformsTask, UsesAbilities{
    private abilityMap: Map<string, Ability> = new Map();

    static named(name: string): Actor {
        return new Actor(name)
    }

    constructor(public readonly name: string) {

    }

    /**
     * assigns an ability to the actor, like Browser, SFT-Client, HTTP-Client ... you name it.
     * @param abilities the ability the actor is able to use
     */
    whoCan(...abilities: Ability[]): Actor {
        for(let ability of abilities) {
            this.abilityMap.set(ability.constructor.name, ability);
        }
        return this;
    }

    /**
     * Executes the given Tasks
     * @param activities a list of tasks to execute
     */
    attemptsTo(...activities: Activity[]): Promise<void>{
        
        let reducefn = (chain: Promise<void>, activity: Activity, ) => {
            return chain.then(() => {
                return activity.performAs(this);
            })
        };
        
        return activities.reduce(reducefn, Promise.resolve());
    }

    /**
     * Enables the Actor to do something ... Gives him the Ability
     * @param ability the ability to do something
     */
    can(ability: Ability): void{
        this.abilityMap.set(ability.constructor.name, ability);
    }

    /**
     *
     * @param Ability the type of Ability the actor should be able to use
     */
    withAbilityTo(Ability: AbilityClass): Ability {

        if(!this.abilityMap.has(Ability.name)) {
            throw new NoSuchAbilityError(`The Actor '${this.name}' does not have the Ability ${Ability.name}`);
        }
        return <Ability>this.abilityMap.get(Ability.name);
    }

    toAnswer<T>(question: Question<T>): Promise<T> {
        return question.answeredBy(this);
    }

}