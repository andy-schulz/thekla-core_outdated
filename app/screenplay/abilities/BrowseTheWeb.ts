import {Ability} from "./Ability";
import {Browser, WebElementFinder} from "../..";
import {UsesAbilities} from "../Actor";
import {FinderLocator, SppFinderRoot, SppWebElementFinder} from "../SppWebElements";

export class BrowseTheWeb implements Ability {

    static using(browser: Browser) {
        return new BrowseTheWeb(browser);
    }

    static as(actor: UsesAbilities): BrowseTheWeb {
        return <BrowseTheWeb>actor.withAbilityTo(BrowseTheWeb);
    }

    constructor(private browser: Browser) {

    }

    find(spe: SppFinderRoot): WebElementFinder {
        const locs: FinderLocator[] = spe.locators();
        let element: WebElementFinder | undefined = undefined;

        for(let loc of locs) {
            if(element === undefined) {
                if(loc.type == "element") {
                    element = this.browser.element(loc.locator);
                }else if (locs[0].type == "element") {
                    // TODO: implement all function
                    // element = this.browser.all(loc.locator);
                } else throw Error(`Locator type ${loc.type} unknown.`);
            } else {
                if(loc.type == "element") {
                    element = element.element(loc.locator);
                }else if (locs[0].type == "element") {
                    // TODO: implement all function
                    // element = element.all(loc.locator);
                } else throw Error(`Locator type ${loc.type} unknown.`);
            }
        }

        return <WebElementFinder>element;
    }

    navigate(url: string) {
        return this.browser.get(url);
    }
}