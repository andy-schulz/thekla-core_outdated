/**
 * Action to drag an element to another element
 */

import {Interaction, SppElement} from "../../../index";
import {stepDetails}             from "../../lib/decorators/step_decorators";
import {FindElements}            from "../abilities/FindElements";
import {UsesAbilities}           from "../../Actor";

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
    public static dragElementToElement(fromElement: SppElement, toElement: SppElement) {
        return new DragToElement(fromElement, toElement)
    }

    private constructor(private fromElement: SppElement, private toElement: SppElement) {
    }
}

export class Drag {
    /**
     * specify which element should be dragged
     * @param element - the SPP Element
     */
    public static element(element: SppElement): Drag {
        return new Drag(element as SppElement);
    }

    /**
     * specify where the first element should be dragged to
     * @param element - the SPP Element
     */
    public toElement(toElement: SppElement): DragToElement {
        return DragToElement.dragElementToElement(this.fromElement, toElement)
    }

    /**
     * @ignore
     */
    private constructor(private fromElement: SppElement) {
    }
}