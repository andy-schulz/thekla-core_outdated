import {Ability}                                           from "../../lib/abilities/Ability";
import {UsesAbilities}                                     from "../../Actor";

export interface AuthenticationInfo{
    username: string;
    password: string
}

export class Authenticate implements Ability {

    static using(authInfo: AuthenticationInfo): Authenticate {
        return new Authenticate(authInfo);
    }

    static as(actor: UsesAbilities): Authenticate {
        return <Authenticate>actor.withAbilityTo(Authenticate);
    }

    constructor(private authenticationInfo: AuthenticationInfo) {

    }

    get username(): string {
        return this.authenticationInfo.username
    }

    get password(): string {
        return this.authenticationInfo.password
    }
}