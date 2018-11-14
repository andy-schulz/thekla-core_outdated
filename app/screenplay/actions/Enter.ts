import {SppWebElementFinder} from "../SppWebElements";
import {Activity, Interaction} from "./Activities";
import {Actor} from "../Actor";
import {BrowseTheWeb} from "../abilities/BrowseTheWeb";

export class Enter implements Interaction {
    private inputField: SppWebElementFinder;

    public static value(inputString: string): Enter {
        return new Enter(inputString);
    }

    constructor(private keySequence: string) {}

    public into(element: SppWebElementFinder) : Activity {
        this.inputField = element;
        return this;
    }

    performAs(actor: Actor): Promise<void> {
        return BrowseTheWeb.as(actor).find(this.inputField).sendKeys(this.keySequence);
    }
}