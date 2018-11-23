import {Question}            from "../../../lib/matcher/Question";
import {UsesAbilities}       from "../../../Actor";
import {SppWebElementFinder} from "../../SppWebElements";
import {BrowseTheWeb}        from "../../../../index";

export class Value implements Question<string> {

    static of(element: SppWebElementFinder): Value  {
        return new Value(element)
    }

    constructor(
        private element: SppWebElementFinder
    ) {}

    answeredBy(actor: UsesAbilities): Promise<string> {
        return BrowseTheWeb.as(actor).findElement(this.element).getAttribute("value");
    }
}