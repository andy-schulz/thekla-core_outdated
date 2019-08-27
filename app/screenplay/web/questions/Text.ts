import {Question}            from "../../lib/questions/Question";
import {UsesAbilities}       from "../../Actor";
import {FindElements}        from "../abilities/FindElements";
import {SppWebElementFinder} from "../SppWebElements";

export class Text implements Question<void, string> {

    public static of(element: SppWebElementFinder): Text  {
        return new Text(element)
    }

    private constructor(
        private element: SppWebElementFinder
    ) {}

    public answeredBy(actor: UsesAbilities): Promise<string> {
        return FindElements.as(actor).findElement(this.element).getText();
    }

    public toString(): string {
        return `Text (innerHTML) of element '${this.element.toString()}'`
    }
}