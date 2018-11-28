import {BrowseTheWeb, Interaction} from "../../../index";
import {SppWebElementFinder}       from "../SppWebElements";
import {UsesAbilities}             from "../../Actor";
import {getLogger, Logger}         from "@log4js-node/log4js-api";


export class Enter implements Interaction {
    private inputField: SppWebElementFinder;
    private logger: Logger = getLogger("Enter");

    public static value(inputString: string | undefined): Enter {
        return new Enter(inputString);
    }

    constructor(private keySequence: string | undefined) {}

    public into(element: SppWebElementFinder): Enter {
        this.inputField = element;
        return this;
    }

    performAs(actor: UsesAbilities): Promise<void> {
        // if undefined do nothing,
        // it makes it possible to work with data structures on forms
        if(this.keySequence === undefined) {
            this.logger.debug(`KeySequence is undefined so nothing is entered into ${this.inputField.toString()}`);
            return Promise.resolve();
        }
        return BrowseTheWeb.as(actor).findElement(this.inputField).sendKeys(this.keySequence);
    }
}