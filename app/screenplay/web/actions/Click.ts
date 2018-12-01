import {BrowseTheWeb, Interaction, SppWebElementFinder} from "../../../index";
import {SppWebElementListFinder}                        from "../SppWebElements";
import {UsesAbilities}                                  from "../../Actor";

export class Click implements Interaction {

    public static on(element: SppWebElementFinder | SppWebElementListFinder): Click {
        return new Click(<SppWebElementFinder>element);
    }

    constructor(private element: SppWebElementFinder) {}

    performAs(actor: UsesAbilities): Promise<void> {
        return BrowseTheWeb.as(actor).findElement(this.element).click();
    }
}