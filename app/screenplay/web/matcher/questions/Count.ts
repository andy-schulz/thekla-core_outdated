import {Question}                                     from "../../../lib/matcher/Question";
import {UsesAbilities}                                from "../../../Actor";
import {SppWebElementListFinder} from "../../SppWebElements";
import {BrowseTheWeb}                                 from "../../../../index";

export class Count implements Question<number> {

    static of(elements: SppWebElementListFinder): Count  {
        return new Count(elements)
    }

    constructor(
        private elements: SppWebElementListFinder
    ) {}

    answeredBy(actor: UsesAbilities): Promise<number> {
        return BrowseTheWeb.as(actor).findElements(this.elements).count();
    }
}