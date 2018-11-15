import {BrowseTheWeb, Activity, Interaction} from "../../";
import {SppWebElementFinder}                 from "../SppWebElements";
import {UsesAbilities}                       from "../Actor";

export class Enter implements Interaction {
    private inputField: SppWebElementFinder;

    public static value(inputString: string): Enter {
        return new Enter(inputString);
    }

    constructor(private keySequence: string) {
    }

    public into(element: SppWebElementFinder): Activity {
        this.inputField = element;
        return this;
    }

    performAs(actor: UsesAbilities): Promise<void> {
        return BrowseTheWeb.as(actor).find(this.inputField).sendKeys(this.keySequence);
    }
}