import {Ability}                                           from "../../lib/abilities/Ability";
import {UsesAbilities}                                     from "../../Actor";

export interface AuthenticationInfo{
    username: string;
    password: string;
}

export class Authenticate implements Ability {

    public static using(authInfo: AuthenticationInfo): Authenticate {
        return new Authenticate(authInfo);
    }

    public static as(actor: UsesAbilities): Authenticate {
        return actor.withAbilityTo(Authenticate) as Authenticate;
    }

    public constructor(private authenticationInfo: AuthenticationInfo) {

    }

    public get username(): string {
        return this.authenticationInfo.username
    }

    public get password(): string {
        return this.authenticationInfo.password
    }
}