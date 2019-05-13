import {Question}            from "../../lib/matcher/Question";
import {UsesAbilities}       from "../../Actor";
import {SppWebElementFinder} from "../SppWebElements";
import {BrowseTheWeb}        from "../../../index";

export class Text implements Question<string> {

    public static of(element: SppWebElementFinder): Text  {
        return new Text(element)
    }

    private constructor(
        private element: SppWebElementFinder
    ) {}

    public answeredBy(actor: UsesAbilities): Promise<string> {
        return BrowseTheWeb.as(actor).findElement(this.element).getText();
    }
}