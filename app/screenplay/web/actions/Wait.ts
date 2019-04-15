/**
 * Wait until a condition is met on a given element
 */
import {stepDetails}           from "../../lib/decorators/StepDecorators";
import {BrowseTheWeb}          from "../abilities/BrowseTheWeb";
import {SppWebElementFinder}   from "../SppWebElements";
import {Interaction}           from "../../lib/actions/Activities";
import {UsesAbilities}  from "../../Actor";
import {getLogger}             from "@log4js-node/log4js-api"
import {UntilElementCondition} from "../../../driver/lib/ElementConditions";

export class Wait implements Interaction {
    private logger = getLogger("Wait");
    private condition: UntilElementCondition;

    /**
     * @ignore
     */
    @stepDetails<UsesAbilities>(`wait for '<<awaitingElement>>' and check '<<condition>>'.`)
    performAs(actor: UsesAbilities): Promise<void> {

        return new Promise((resolve, reject) => {
            BrowseTheWeb.as(actor).wait(this.condition, this.awaitingElement)
                .then((message: string) => {
                    this.logger.debug(message);
                    resolve();
                })
                .catch(reject)
        });
    }

    /**
     * wait until a condition is met for the given element
     * @param awaitingElement the elements to wait for
     */
    public static for(awaitingElement: SppWebElementFinder) {
        return new Wait(awaitingElement);
    }

    /**
     * specify the condition to wait for of the given element
     * @param condition the condition to be waiting for
     */
    public andCheck(condition: UntilElementCondition) {
        this.condition = condition;
        return this;
    }

    /**
     * @ignore
     */
    constructor(private awaitingElement: SppWebElementFinder) {}


}