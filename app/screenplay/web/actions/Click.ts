/**
 * Action to click on a web element
 */

import {BrowseTheWeb, Interaction, SppWebElementFinder} from "../../../index";
import {stepDetails}                                    from "../../lib/decorators/StepDecorators";
import {SppWebElementListFinder}                        from "../SppWebElements";
import {UsesAbilities}                                  from "../../Actor";

export class Click implements Interaction {

    /**
     * @ignore
     */
    @stepDetails<UsesAbilities>(`click on element: '<<element>>'`)
    performAs(actor: UsesAbilities): Promise<void> {
        return BrowseTheWeb.as(actor).findElement(this.element).click();
    }

    /**
     * specify which element should be clicked on
     * @param element - the SPP Element
     */
    public static on(element: SppWebElementFinder | SppWebElementListFinder): Click {
        return new Click(<SppWebElementFinder>element);
    }

    /**
     * @ignore
     */
    constructor(public element: SppWebElementFinder) {
    }
}