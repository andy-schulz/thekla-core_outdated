import {WebElementListFinder}                                        from "../../../driver/interface/WebElements";
import {UntilElementCondition}                                       from "../../../driver/lib/element/ElementConditions";
import {AbilitySet, Ability}                                         from "../../lib/abilities/Ability";
import {Browser, until, WebElementFinder}                            from "../../../index";
import {UsesAbilities}                                               from "../../Actor";
import {SppFinderRoot, SppWebElementFinder, SppWebElementListFinder} from "../SppWebElements";
import {FindElements}                                                from "./FindElements";
import {UseBrowserFeatures}                                          from "./UseBrowserFeatures";
import {WaitOnElements}                                              from "./WaitOnElements";

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

    // public findElement(spe: SppWebElementFinder): WebElementFinder {
    //     return this.find(spe) as WebElementFinder;
    // }
    //
    // public findElements(spes: SppWebElementListFinder): WebElementListFinder {
    //     return this.find(spes) as WebElementListFinder;
    // }
    //
    // public find(spe: SppFinderRoot): WebElementFinder | WebElementListFinder {
    //     return spe.getElements(this.client)
    // }
    //
    // public navigate(url: string): Promise<void> {
    //     return this.client.get(url);
    // }
    //
    // public wait(condition: UntilElementCondition, element: SppWebElementFinder): Promise<string> {
    //     return this.client.wait(
    //         until(condition.waiter.isFulfilledFor(element.getElements(this.client) as WebElementFinder)),
    //         condition.timeout,
    //         condition.conditionHelpText);
    // }
    //
    // public getCurrentUrl(): Promise<string> {
    //     return this.client.getCurrentUrl();
    // }
    //
    // public getTitle(): Promise<string> {
    //     return this.client.getTitle()
    // }
    //
    // public scrollTo({x,y}: {x: number; y: number}): Promise<void> {
    //     return this.client.scrollTo({x,y});
    // }
}