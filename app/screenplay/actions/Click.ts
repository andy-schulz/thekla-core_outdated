import {BrowseTheWeb, Interaction, SppWebElementFinder} from "../../";
import {SppWebElementListFinder}                        from "../SppWebElements";
import {UsesAbilities}                                  from "../Actor";

export class Click implements Interaction {

    public static on(element: SppWebElementFinder | SppWebElementListFinder): Click {
        return new Click(element);
    }

    constructor(private element: SppWebElementFinder) {}

    performAs(actor: UsesAbilities): Promise<void> {
        return BrowseTheWeb.as(actor).find(this.element).click();
    }
}