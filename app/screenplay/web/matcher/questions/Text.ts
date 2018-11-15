import {Question}                                     from "../../../lib/matcher/questions/Question";
import {UsesAbilities}                                from "../../../Actor";
import {SppWebElementFinder, SppWebElementListFinder} from "../../SppWebElements";
import {BrowseTheWeb}                                 from "../../../../index";

export class Text implements Question<string> {

    static of(element: SppWebElementFinder): Text  {
        return new Text(element)
    }

    constructor(
        private element: SppWebElementFinder
    ) {}

    answeredBy(actor: UsesAbilities): Promise<string> {
        return BrowseTheWeb.as(actor).find(this.element).getText();
    }
}