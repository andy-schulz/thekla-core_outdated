import {Question}            from "../../lib/matcher/Question";
import {UsesAbilities}       from "../../Actor";
import {SppWebElementFinder} from "../SppWebElements";
import {BrowseTheWeb}        from "../../../index";

export class Attribute implements Question<string> {
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
}