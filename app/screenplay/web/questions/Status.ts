import {UsesAbilities}       from "../../Actor";
import {Question}            from "../../lib/questions/Question";
import {FindElements}        from "../abilities/FindElements";
import {SppWebElementFinder} from "../SppWebElements";

class VisibleStatus implements Question<void, boolean>{

    public answeredBy(actor: UsesAbilities): Promise<boolean> {
        return FindElements.as(actor).findElement(this.element).isVisible();
    }

    public constructor(private element: SppWebElementFinder) {

    }

    public toString(): string {
        return `Status of element '${this.element.toString()}'`
    }
}


class EnableStatus implements Question<void, boolean>{

    public answeredBy(actor: UsesAbilities): Promise<boolean> {
        return FindElements.as(actor).findElement(this.element).isEnabled();
    }

    public constructor(private element: SppWebElementFinder) {

    }
}

export class Status  {

    public static visible = {
        of: (element: SppWebElementFinder): VisibleStatus => {
            return new VisibleStatus(element)
        }
    };

    public static enable = {
        of: (element: SppWebElementFinder): EnableStatus => {
            return new EnableStatus(element)
        }
    }
}



