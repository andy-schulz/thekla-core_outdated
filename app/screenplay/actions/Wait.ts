import {SppWebElementFinder, SppWebElementListFinder} from "../SppWebElements";
import {Interaction} from "./Activities";
import {Actor} from "../Actor";
import {BrowseTheWeb} from "../abilities/BrowseTheWeb";
import {Utils} from "../../src/utils/Utils";

export class Wait implements Interaction {
    public static for(waitCondition: SppWebElementFinder | number) {
        return new Wait(waitCondition);
    }

    constructor(private waitCondition: SppWebElementFinder | number) {}

    performAs(actor: Actor): Promise<void> {
        if(typeof this.waitCondition === "number") {
            return Utils.wait(this.waitCondition).then((message) => {
                return console.log(message);
            });
        } else {
            throw Error("Waiting for elements is not implemented yet.")
        }
    }
}