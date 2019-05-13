import {UsesAbilities}       from "../../Actor";
import {Question}            from "../../lib/matcher/Question";
import {BrowseTheWeb}        from "../abilities/BrowseTheWeb";
import {SppWebElementFinder} from "../SppWebElements";
class VisibleStatus implements Question<boolean>{

    public answeredBy(actor: UsesAbilities): Promise<boolean> {
        return BrowseTheWeb.as(actor).findElement(this.element).isVisible();
    }

    public constructor(private element: SppWebElementFinder) {

    }
}


class EnableStatus implements Question<boolean>{

    public answeredBy(actor: UsesAbilities): Promise<boolean> {
        return BrowseTheWeb.as(actor).findElement(this.element).isEnabled();
    }

    public constructor(private element: SppWebElementFinder) {

    }
}

export class Status  {

    public static visible = {
        of: (element: SppWebElementFinder): VisibleStatus => {
            return new VisibleStatus(element)
        }
    };

    public static enable = {
        of: (element: SppWebElementFinder): EnableStatus => {
            return new EnableStatus(element)
        }
    }
}



