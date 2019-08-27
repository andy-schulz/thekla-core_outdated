import {WebElementListFinder}                                        from "../../../driver/interface/WebElements";
import {UntilElementCondition}                                       from "../../../driver/lib/element/ElementConditions";
import {AbilitySet, Ability}                                         from "../../lib/abilities/Ability";
import {Browser, until, WebElementFinder}                            from "../../../index";
import {UsesAbilities}                                               from "../../Actor";
import {SppFinderRoot, SppWebElementFinder, SppWebElementListFinder} from "../SppWebElements";
import {FindElements}                                                from "./FindElements";

export class UseBrowserFeatures implements Ability {

    public isAbilityList(): boolean {
        return false;
    }

    public getAbilities(): Ability[] {
        return [this];
    }

    public static using(browser: Browser): UseBrowserFeatures {
        return new UseBrowserFeatures(browser);
    }

    public static as(actor: UsesAbilities): UseBrowserFeatures {
        return actor.withAbilityTo(UseBrowserFeatures) as UseBrowserFeatures;
    }

    public constructor(private client: Browser) {
    }

    public navigate(url: string): Promise<void> {
        return this.client.get(url);
    }

    public wait(condition: UntilElementCondition, element: SppWebElementFinder): Promise<string> {
        return this.client.wait(
            until(condition.waiter.isFulfilledFor(element.getElements(this.client) as WebElementFinder)),
            condition.timeout,
            condition.conditionHelpText);
    }

    public getCurrentUrl(): Promise<string> {
        return this.client.getCurrentUrl();
    }

    public getTitle(): Promise<string> {
        return this.client.getTitle()
    }

    public scrollTo({x,y}: {x: number; y: number}): Promise<void> {
        return this.client.scrollTo({x,y});
    }
}