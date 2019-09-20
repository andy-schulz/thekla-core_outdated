/**
 * Action to hover over a web element
 */

import {Interaction, SppElement} from "../../../index";
import {stepDetails}             from "../../lib/decorators/step_decorators";
import {FindElements}            from "../abilities/FindElements";
import {SppElementList}          from "../SppWebElements";
import {UsesAbilities}           from "../../Actor";

export class Hover implements Interaction<void, void> {

    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`hover over element: '<<element>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return FindElements.as(actor).findElement(this.element).hover();
    }

    /**
     * specify which element should be hovered over
     * @param element - the SPP Element
     */
    public static over(element: SppElement | SppElementList): Hover {
        return new Hover(element as SppElement);
    }

    /**
     * @ignore
     */
    private constructor(public element: SppElement) {
    }
}