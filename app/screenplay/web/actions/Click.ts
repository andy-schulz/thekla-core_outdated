/**
 * Action to click on a web element
 */

import {Interaction, SppElement} from "../../../index";
import {stepDetails}             from "../../lib/decorators/step_decorators";
import {FindElements}            from "../abilities/FindElements";
import {SppElementList}          from "../SppWebElements";
import {UsesAbilities}           from "../../Actor";

export class Click implements Interaction<void, void> {

    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`click on element: '<<element>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return FindElements.as(actor).findElement(this.element).click();
    }

    /**
     * specify which element should be clicked on
     * @param element - the SPP Element
     */
    public static on(element: SppElement | SppElementList): Click {
        return new Click(element as SppElement);
    }

    /**
     * @ignore
     */
    private constructor(public element: SppElement) {
    }
}