import {WebElementListFinder}                                        from "../../../driver/interface/WebElements";
import {UntilElementCondition}                                       from "../../../driver/lib/element/ElementConditions";
import {Ability}                                                     from "../../lib/abilities/Ability";
import {Browser, until, WebElementFinder}                            from "../../../index";
import {UsesAbilities}                                               from "../../Actor";
import {SppFinderRoot, SppWebElementFinder, SppWebElementListFinder} from "../SppWebElements";

export class FindElements implements Ability {

    public isAbilityList(): boolean {
        return false;
    }

    public getAbilities(): Ability[] {
        return [this];
    }

    public static using(client: Browser): FindElements {
        return new FindElements(client);
    }

    public static as(actor: UsesAbilities): FindElements {
        return actor.withAbilityTo(FindElements) as FindElements;
    }

    public constructor(private browser: Browser) {

    }

    public findElement(spe: SppWebElementFinder): WebElementFinder {
        return this.find(spe) as WebElementFinder;
    }

    public findElements(spes: SppWebElementListFinder): WebElementListFinder {
        return this.find(spes) as WebElementListFinder;
    }

    public find(spe: SppFinderRoot): WebElementFinder | WebElementListFinder {
        return spe.getElements(this.browser)
    }
}