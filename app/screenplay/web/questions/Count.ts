import {Question}                from "../../lib/matcher/Question";
import {UsesAbilities}           from "../../Actor";
import {SppWebElementListFinder} from "../SppWebElements";
import {BrowseTheWeb}            from "../../../index";

export class Count implements Question<number> {

    public static of(elements: SppWebElementListFinder): Count  {
        return new Count(elements)
    }

    private constructor(
        private elements: SppWebElementListFinder
    ) {}

    public answeredBy(actor: UsesAbilities): Promise<number> {
        return BrowseTheWeb.as(actor).findElements(this.elements).count();
    }
}