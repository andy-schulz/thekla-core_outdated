import {SppWebElementFinder} from "../SppWebElements";
import {Interaction}         from "../../lib/actions/Activities";
import {Actor}               from "../../Actor";
import {Utils}               from "../../../src/utils/Utils";
import {getLogger}           from "@log4js-node/log4js-api"

export class Wait implements Interaction {
    private logger = getLogger("Wait");

    public static for(waitCondition: SppWebElementFinder | number) {
        return new Wait(waitCondition);
    }

    constructor(private waitCondition: SppWebElementFinder | number) {}

    performAs(actor: Actor): Promise<void> {
        if(typeof this.waitCondition === "number") {
            return Utils.wait(this.waitCondition).then((message: any) => {
                return this.logger.debug(`Waited for ${this.waitCondition}`);
            });
        } else {
            throw Error("Waiting for elements is not implemented yet.")
        }
    }
}