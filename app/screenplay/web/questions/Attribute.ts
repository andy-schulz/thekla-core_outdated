import {Question}      from "../../lib/questions/Question";
import {UsesAbilities} from "../../Actor";
import {FindElements}  from "../abilities/FindElements";
import {SppElement}    from "../SppWebElements";

export class Attribute implements Question<void, string> {
    private attributeName = ``;

    public answeredBy(actor: UsesAbilities): Promise<string> {
        return FindElements.as(actor).findElement(this.element).getAttribute(this.attributeName);
    }

    public static of(element: SppElement): Attribute  {
        return new Attribute(element)
    }

    public called(attributeName: string): Attribute {
        this.attributeName = attributeName;
        return this;
    }

    private constructor(
        private element: SppElement
    ) {}

    public toString(): string {
        return `Attribute '${this.attributeName}' of element '${this.element.toString()}'`
    }
}