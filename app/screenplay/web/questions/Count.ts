import {Question}                from "../../lib/questions/Question";
import {UsesAbilities}           from "../../Actor";
import {FindElements}            from "../abilities/FindElements";
import {SppWebElementListFinder} from "../SppWebElements";

export class Count implements Question<void, number> {

    public static of(elements: SppWebElementListFinder): Count  {
        return new Count(elements)
    }

    private constructor(
        private elements: SppWebElementListFinder
    ) {}

    public answeredBy(actor: UsesAbilities): Promise<number> {
        return FindElements.as(actor).findElements(this.elements).count();
    }

    public toString(): string {
        return `count of elements '${this.elements.toString()}'`
    }
}