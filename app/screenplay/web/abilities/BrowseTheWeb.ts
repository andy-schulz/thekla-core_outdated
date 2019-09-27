import {AbilitySet, Ability} from "../../lib/abilities/Ability";
import {Browser}             from "../../../index";
import {UsesAbilities}       from "../../Actor";
import {FindElements}        from "./FindElements";
import {UseBrowserFeatures}  from "./UseBrowserFeatures";
import {WaitOnElements}      from "./WaitOnElements";

export class BrowseTheWeb implements AbilitySet {

    private abilities: Ability[] = [];

    public isAbilityList(): boolean {
        return true;
    }

    public getAbilities(): Ability[] {
        return this.abilities;
    }

    public static using(browser: Browser): BrowseTheWeb {
        return new BrowseTheWeb(browser);
    }

    public static as(actor: UsesAbilities): BrowseTheWeb {
        return actor.withAbilityTo(BrowseTheWeb) as BrowseTheWeb;
    }

    public constructor(private client: Browser) {
        this.abilities.push(FindElements.using(client) as Ability);
        this.abilities.push(WaitOnElements.using(client) as Ability);
        this.abilities.push(UseBrowserFeatures.using(client));
    }
}