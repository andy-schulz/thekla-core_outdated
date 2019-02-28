import {BrowseTheWeb}          from "../abilities/BrowseTheWeb";
import {SppWebElementFinder}   from "../SppWebElements";
import {Interaction}           from "../../lib/actions/Activities";
import {Actor}                 from "../../Actor";
import {getLogger}             from "@log4js-node/log4js-api"
import {UntilElementCondition} from "../../../driver/lib/ElementConditions";

export class Wait implements Interaction {
    private logger = getLogger("Wait");
    private condition: UntilElementCondition;

    public static for(waitCondition: SppWebElementFinder) {
        return new Wait(waitCondition);
    }

    public andCheck(condition: UntilElementCondition) {
        this.condition = condition;
        return this;
    }

    constructor(private waitCondition: SppWebElementFinder | number) {}

    performAs(actor: Actor): Promise<void> {

        return new Promise((resolve, reject) => {
            BrowseTheWeb.as(actor).wait(this.condition, this.waitCondition as SppWebElementFinder)
                .then((message: string) => {
                    this.logger.debug(message);
                    resolve();
                })
                .catch(reject)
        });

    }
}