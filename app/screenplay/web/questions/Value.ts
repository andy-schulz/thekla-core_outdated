import {Question}            from "../../lib/questions/Question";
import {UsesAbilities}       from "../../Actor";
import {FindElements}        from "../abilities/FindElements";
import {SppWebElementFinder} from "../SppWebElements";

export class Value implements Question<void, string> {

    public static of(element: SppWebElementFinder): Value  {
        return new Value(element)
    }

    private constructor(
        private element: SppWebElementFinder
    ) {}

    public answeredBy(actor: UsesAbilities): Promise<string> {
        return FindElements.as(actor).findElement(this.element).getAttribute(`value`);
    }

    public toString(): string {
        return `Attribute 'value' of element '${this.element.toString()}'`;
    }
}