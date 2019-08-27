import {Actor}                 from "../Actor";
import {Ability, AbilityClass} from "../lib/abilities/Ability";

class DoesNotHaveTheAbility extends Error{
    public constructor(
        private _ability: AbilityClass,
        private _actor: Actor) {

        super(`
        Actor '${_actor.name}' does not have the ability ${_ability.constructor.name}
        try assigning an abiliy with:
        ${_actor.name}.can(${_ability.constructor.name}.<<abilityConfigMethod()>>)
        `);
        Error.captureStackTrace(this, DoesNotHaveTheAbility)
    }

    public get actor(): Actor {
        return this._actor
    }

    public get ability(): AbilityClass {
        return this._ability;
    }
}


export class DoesNotHave {

    public static theAbility(theAbility: AbilityClass): DoesNotHave {
        return new DoesNotHave(theAbility)
    }

    public usedBy(theActor: Actor): DoesNotHaveTheAbility {
        return new DoesNotHaveTheAbility(this.theAbility, theActor);
    }

    private constructor(private theAbility: AbilityClass) {
    }
}

