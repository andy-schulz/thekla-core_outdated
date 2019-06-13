import {Question}            from "../../lib/questions/Question";
import {UsesAbilities}       from "../../Actor";
import {SppWebElementFinder} from "../SppWebElements";
import {BrowseTheWeb}        from "../../../index";

export class Attribute implements Question<void, string> {
    private attributeName: string = ``;

    public static of(element: SppWebElementFinder): Attribute  {
        return new Attribute(element)
    }

    public called(attributeName: string): Attribute {
        this.attributeName = attributeName;
        return this;
    }

    private constructor(
        private element: SppWebElementFinder
    ) {}

    public answeredBy(actor: UsesAbilities): Promise<string> {
        return BrowseTheWeb.as(actor).findElement(this.element).getAttribute(this.attributeName);
    }

    public toString(): string {
        return `Attribute '${this.attributeName}' of element '${this.element.toString()}'`
    }
}