import {WebElementListFinder}                                        from "../../../driver/interface/WebElements";
import {Ability}                                                     from "../../lib/abilities/Ability";
import {Browser, WebElementFinder}                                   from "../../../index";
import {UsesAbilities}                                               from "../../Actor";
import {SppFinderRoot, SppWebElementFinder, SppWebElementListFinder} from "../SppWebElements";

export class BrowseTheWeb implements Ability {

    static using(browser: Browser) {
        return new BrowseTheWeb(browser);
    }

    static as(actor: UsesAbilities): BrowseTheWeb {
        return <BrowseTheWeb>actor.withAbilityTo(BrowseTheWeb);
    }

    constructor(private browser: Browser) {

    }

    findElement(spe: SppWebElementFinder): WebElementFinder {
        return <WebElementFinder>this.find(spe);
    }

    findElements(spes: SppWebElementListFinder): WebElementListFinder {
        return <WebElementListFinder>this.find(spes);
    }

    find(spe: SppFinderRoot): WebElementFinder | WebElementListFinder {
        return spe.getElements(this.browser)
    }

    navigate(url: string): Promise<void> {
        return this.browser.get(url);
    }
}