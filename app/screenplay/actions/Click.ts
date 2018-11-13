import {SppWebElementFinder, SppWebElementListFinder} from "../WebElementSpp";
import {Interaction} from "./Activities";
import {Actor} from "../Actor";
import {BrowseTheWeb} from "../abilities/BrowseTheWeb";

export class Click implements Interaction {

    public static on(element: SppWebElementFinder | SppWebElementListFinder) {
        return new Click(element);
    }

    constructor(private element: SppWebElementFinder) {}

    performAs(actor: Actor): Promise<void> {
        return BrowseTheWeb.as(actor).find(this.element).click();
    }
}