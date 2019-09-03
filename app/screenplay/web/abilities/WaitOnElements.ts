import {UntilElementCondition}                                       from "../../../driver/lib/element/ElementConditions";
import {Ability}                                                     from "../../lib/abilities/Ability";
import {Browser, until, WebElementFinder}                            from "../../../index";
import {UsesAbilities}                                               from "../../Actor";
import {SppWebElementFinder} from "../SppWebElements";

export class WaitOnElements implements Ability {

    public isAbilityList(): boolean {
        return false;
    }

    public getAbilities(): Ability[] {
        return [this];
    }

    public static using(client: Browser): WaitOnElements {
        return new WaitOnElements(client);
    }

    public static as(actor: UsesAbilities): WaitOnElements {
        return actor.withAbilityTo(WaitOnElements) as WaitOnElements;
    }

    public constructor(private client: Browser) {

    }

    public wait(condition: UntilElementCondition, element: SppWebElementFinder): Promise<string> {
        return this.client.wait(
            until(condition.waiter.isFulfilledFor(element.getElements(this.client) as WebElementFinder)),
            condition.timeout,
            condition.conditionHelpText);
    }
}