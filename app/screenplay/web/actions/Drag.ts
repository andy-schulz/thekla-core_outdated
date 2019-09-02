/**
 * Action to drag an element to another element
 */

import {Interaction, SppWebElementFinder} from "../../../index";
import {stepDetails}                      from "../../lib/decorators/step_decorators";
import {FindElements}                     from "../abilities/FindElements";
import {UsesAbilities}                    from "../../Actor";

/**
 * the Drag and Drop interaction
 */
class DragToElement implements Interaction<void, void> {
    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`click on element: '<<element>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return FindElements.as(actor).findElement(this.fromElement)
            .dragToElement(FindElements.as(actor).findElement(this.toElement));
    }

    /**
     * drag the fromElement and drop it to the toElement
     * @param fromElement - the draggable element
     * @param toElement - the droppable element
     */
    public static dragElementToElement(fromElement: SppWebElementFinder, toElement: SppWebElementFinder) {
        return new DragToElement(fromElement, toElement)
    }

    private constructor(private fromElement: SppWebElementFinder, private toElement: SppWebElementFinder) {
    }
}

export class Drag {
    /**
     * specify which element should be dragged
     * @param element - the SPP Element
     */
    public static element(element: SppWebElementFinder): Drag {
        return new Drag(element as SppWebElementFinder);
    }

    /**
     * specify where the first element should be dragged to
     * @param element - the SPP Element
     */
    public toElement(toElement: SppWebElementFinder): DragToElement {
        return DragToElement.dragElementToElement(this.fromElement, toElement)
    }

    /**
     * @ignore
     */
    private constructor(private fromElement: SppWebElementFinder) {
    }
}