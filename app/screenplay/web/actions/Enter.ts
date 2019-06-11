import {BrowseTheWeb, Interaction} from "../../../index";
import {stepDetails}               from "../../lib/decorators/step_decorators";
import {SppWebElementFinder}       from "../SppWebElements";
import {UsesAbilities}             from "../../Actor";
import {getLogger, Logger}         from "@log4js-node/log4js-api";


export class Enter implements Interaction<void, void> {
    private inputField: SppWebElementFinder;
    private clearBeforeFill: boolean = false;
    private logger: Logger = getLogger(`Enter`);

    public static value(inputString: string | undefined): Enter {
        return new Enter(inputString);
    }

    private constructor(private keySequence: string | undefined) {}

    public into(element: SppWebElementFinder): Enter {
        this.inputField = element;
        return this;
    }

    public butClearsTheFieldBefore(clear: boolean = true): Enter {
        this.clearBeforeFill = clear;
        return this;
    }

    @stepDetails<UsesAbilities, void, void>(`enter the value '<<keySequence>>' into field: <<inputField>>`)
    public performAs(actor: UsesAbilities): Promise<void> {
        // if undefined do nothing,
        // it makes it possible to work with data structures on forms
        if(this.keySequence === undefined) {
            this.logger.debug(`KeySequence is undefined so nothing is entered into ${this.inputField.toString()}`);
            return Promise.resolve();
        }
        return Promise.resolve()
            .then((): Promise<void> | void => {
                if(this.clearBeforeFill)
                    return BrowseTheWeb.as(actor).findElement(this.inputField).clear();
            })
            .then((): Promise<void> => BrowseTheWeb.as(actor).findElement(this.inputField).sendKeys(this.keySequence as string));
    }
}