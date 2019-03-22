import {BrowseTheWeb, Interaction, PerformsTask, SppWebElementFinder} from "../../../index";
import {step, stepDetails}                                            from "../../lib/decorators/StepDecorators";
import {SppWebElementListFinder}                                      from "../SppWebElements";
import {UsesAbilities}                                                from "../../Actor";

export class Click implements Interaction {


    public static on(element: SppWebElementFinder | SppWebElementListFinder): Click {
        return new Click(<SppWebElementFinder>element);
    }

    constructor(public element: SppWebElementFinder) {
    }

    @stepDetails<UsesAbilities>(`click on element: '<<element>>'`)
    performAs(actor: UsesAbilities): Promise<void> {
        return BrowseTheWeb.as(actor).findElement(this.element).click();
    }
}