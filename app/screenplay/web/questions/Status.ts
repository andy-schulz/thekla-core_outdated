import {UsesAbilities} from "../../Actor";
import {Question}      from "../../lib/questions/Question";
import {FindElements}  from "../abilities/FindElements";
import {SppElement}    from "../SppWebElements";

class VisibleStatus implements Question<void, boolean>{

    public answeredBy(actor: UsesAbilities): Promise<boolean> {
        return FindElements.as(actor).findElement(this.element).isVisible();
    }

    public constructor(private element: SppElement) {

    }

    public toString(): string {
        return `Status of element '${this.element.toString()}'`
    }
}

class EnableStatus implements Question<void, boolean>{

    public answeredBy(actor: UsesAbilities): Promise<boolean> {
        return FindElements.as(actor).findElement(this.element).isEnabled();
    }

    public constructor(private element: SppElement) {

    }
}

export class Status  {

    public static visible = {
        of: (element: SppElement): VisibleStatus => {
            return new VisibleStatus(element)
        }
    };

    public static enable = {
        of: (element: SppElement): EnableStatus => {
            return new EnableStatus(element)
        }
    }
}