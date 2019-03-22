import {WebElementListFinder}                                        from "../../../driver/interface/WebElements";
import {UntilElementCondition}                                       from "../../../driver/lib/ElementConditions";
import {Ability}                                                     from "../../lib/abilities/Ability";
import {Browser, until, WebElementFinder}                            from "../../../index";
import {UsesAbilities}                                               from "../../Actor";
import {SppFinderRoot, SppWebElementFinder, SppWebElementListFinder} from "../SppWebElements";

export class BrowseTheWeb implements Ability {

    static using(browser: Browser) {
        return new BrowseTheWeb(browser);
    }

    static as(actor: UsesAbilities): BrowseTheWeb {
        return actor.withAbilityTo(BrowseTheWeb) as BrowseTheWeb;
    }

    constructor(private browser: Browser) {

    }

    findElement(spe: SppWebElementFinder): WebElementFinder {
        return this.find(spe) as WebElementFinder;
    }

    findElements(spes: SppWebElementListFinder): WebElementListFinder {
        return this.find(spes) as WebElementListFinder;
    }

    find(spe: SppFinderRoot): WebElementFinder | WebElementListFinder {
        return spe.getElements(this.browser)
    }

    navigate(url: string): Promise<void> {
        return this.browser.get(url);
    }

    wait(condition: UntilElementCondition, element: SppWebElementFinder): Promise<string> {
        return this.browser.wait2(condition, element.getElements(this.browser) as WebElementFinder);
    }
}