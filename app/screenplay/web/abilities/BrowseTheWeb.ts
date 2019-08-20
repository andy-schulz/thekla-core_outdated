import {WebElementListFinder}                                        from "../../../driver/interface/WebElements";
import {UntilElementCondition}                                       from "../../../driver/lib/element/ElementConditions";
import {ExecuteConditionWdjs}                                        from "../../../driver/wdjs/ExecuteConditionWdjs";
import {Ability}                                                     from "../../lib/abilities/Ability";
import {Browser, until, WebElementFinder}                            from "../../../index";
import {UsesAbilities}                                               from "../../Actor";
import {SppFinderRoot, SppWebElementFinder, SppWebElementListFinder} from "../SppWebElements";

export class BrowseTheWeb implements Ability {

    public static using(browser: Browser): BrowseTheWeb {
        return new BrowseTheWeb(browser);
    }

    public static as(actor: UsesAbilities): BrowseTheWeb {
        return actor.withAbilityTo(BrowseTheWeb) as BrowseTheWeb;
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

    public navigate(url: string): Promise<void> {
        return this.browser.get(url);
    }

    public wait(condition: UntilElementCondition, element: SppWebElementFinder): Promise<string> {
        return this.browser.wait(
            until(condition.waiter.isFulfilledFor(element.getElements(this.browser) as WebElementFinder)),
            condition.timeout,
            condition.conditionHelpText);
    }

    public getCurrentUrl(): Promise<string> {
        return this.browser.getCurrentUrl();
    }

    public getTitle(): Promise<string> {
        return this.browser.getTitle()
    }

    public scrollTo({x,y}: {x: number; y: number}): Promise<void> {
        return this.browser.scrollTo({x,y});
    }
}