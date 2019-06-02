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
import {DoesNotHave}           from "./errors/DoesNotHave";
import {Question}              from "./lib/questions/Question";


export interface AnswersQuestions {
    toAnswer<PT, RT>(question: Question<PT,RT>, activityResult: PT): Promise<RT>;
}

// interface TaskPerfomer {
//     <P,R1>(
//         a1: Activity<P,R1>): Promise<R1>;
//     <P,R1,R2>(
//         a1: Activity<P,R1>,
//         a2: Activity<R1,R2>): Promise<R2>;
//     // <P,R1,R2,R3>(
//     //     a1: Activity<P,R1>,
//     //     a2: Activity<R1,R2>,
//     //     a3: Activity<R2,R3>): Promise<R2>;
// }

export interface PerformsTask {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attemptsTo<PT,RT>(...activities: Activity<any, any>[]): Promise<RT>;
}

export interface UsesAbilities {
    // abilityTo(Ability: AbilityClass): Ability;
    withAbilityTo(Ability: AbilityClass): Ability;
    can(ability: Ability): void;
}

export class Actor implements AnswersQuestions, PerformsTask, UsesAbilities{
    private abilityMap: Map<string, Ability> = new Map();

    public static named(name: string): Actor {
        return new Actor(name)
    }

    private constructor(public readonly name: string) {

    }

    /**
     * assigns an ability to the actor, like Browser, SFT-Client, HTTP-Client ... you name it.
     * @param abilities the ability the actor is able to use
     */
    public whoCan(...abilities: Ability[]): Actor {
        for(let ability of abilities) {
            this.abilityMap.set(ability.constructor.name, ability);
        }
        return this;
    }

    /**
     * Executes the given Tasks
     * @param activities a list of tasks to execute
     */

    // public attemptsTo<PT,RT>(...activities: Activity<PT, RT>[]): Promise<RT>{
    // public attemptsTo<P,R1, R2>(
    //     a1: Activity<P, R1>
    // ): Promise<R2>;
    // public attemptsTo<P,R1,R2>(
    //     a1: Activity<P, R1>,
    //     a2: Activity<R1, R2>
    // ): Promise<R2>;
    // public attemptsTo<P,R1,R2, R3>(
    //     a1: Activity<P, R1>,
    //     a2: Activity<R1, R2>,
    //     a3: Activity<R2, R3>
    // ): Promise<R3>;
    // public attemptsTo<P,R1,R2>(
    //     result: P,
    //     a1: Activity<P, R1>,
    //     a2: Activity<R1, R2>,
    // ): Promise<R2>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public attemptsTo<PT,RT>(...activities: Activity<any, any>[]): Promise<RT>
    {

        let reducefn = (chain: Promise<PT>, activity: Activity<PT, RT>): Promise<RT> => {
            return chain.then((result: PT): Promise<RT> => {
                return activity.performAs(this, result);
            })
        };

        // @ts-ignore
        return activities.reduce(reducefn, Promise.resolve())

    }

    /**
     * Enables the Actor to do something ... Gives him the Ability
     * @param ability the ability to do something
     */
    public can(ability: Ability): void{
        this.abilityMap.set(ability.constructor.name, ability);
    }

    /**
     *
     * @param ability provides the interactions the actor should be able to use
     */
    public withAbilityTo(ability: AbilityClass): Ability {

        if(!this.abilityMap.has(ability.name)) {
            throw DoesNotHave.theAbility(ability).usedBy(this);
        }
        return this.abilityMap.get(ability.name) as Ability;
    }

    public toAnswer<PT,RT>(question: Question<PT,RT>, activityResult: PT): Promise<RT> {
        return question.answeredBy(this, activityResult);
    }

}