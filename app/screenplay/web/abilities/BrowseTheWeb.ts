import {WebElementListFinder}                                                       from "../../../interface/WebElements";
import {Ability}                                                                    from "../../lib/abilities/Ability";
import {Browser, WebElementFinder}                                                  from "../../../index";
import {UsesAbilities}                                                              from "../../Actor";
import {FinderLocator, SppFinderRoot, SppWebElementFinder, SppWebElementListFinder} from "../SppWebElements";

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

    // find1(spe: SppFinderRoot): WebElementFinder | WebElementListFinder {
    //     const locs: FinderLocator[] = spe.locators();
    //     let elems: WebElementFinder | WebElementListFinder | undefined = undefined;
    //     let first = true;
    //     for(let loc of locs) {
    //         if(elems === undefined) {
    //             first = false;
    //             if(loc.type == "element") {
    //                 elems = this.browser.element(loc.locator).called(spe.description);
    //             }else if (loc.type == "all") {
    //                 elems = this.browser.all(loc.locator).called(spe.description);
    //             } else throw Error(`Locator type ${loc.type} unknown.`);
    //         } else {
    //             if(loc.type == "element") {
    //                 elems = elems.element(loc.locator).called(spe.description);
    //             }else if (loc.type == "all") {
    //                 elems = elems.all(loc.locator).called(spe.description);
    //             } else throw Error(`Locator type ${loc.type} unknown.`);
    //         }
    //     }
    //     return <WebElementFinder | WebElementListFinder>elems;
    // }

    navigate(url: string) {
        return this.browser.get(url);
    }
}