import {Question}            from "../../lib/matcher/Question";
import {UsesAbilities}       from "../../Actor";
import {SppWebElementFinder} from "../SppWebElements";
import {BrowseTheWeb}        from "../../../index";

export class Attribute implements Question<string> {
    private attributeName: string = "";

    static of(element: SppWebElementFinder): Attribute  {
        return new Attribute(element)
    }

    public called(attributeName: string) {
        this.attributeName = attributeName;
        return this;
    }

    constructor(
        private element: SppWebElementFinder
    ) {}

    answeredBy(actor: UsesAbilities): Promise<string> {
        return BrowseTheWeb.as(actor).findElement(this.element).getAttribute(this.attributeName);
    }
}