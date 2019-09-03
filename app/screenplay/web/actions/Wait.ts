/**
 * Wait until a condition is met on a given element
 */
import {stepDetails}           from "../../lib/decorators/step_decorators";
import {WaitOnElements}        from "../abilities/WaitOnElements";
import {SppWebElementFinder}   from "../SppWebElements";
import {Interaction}           from "../../lib/actions/Activities";
import {UsesAbilities}         from "../../Actor";
import {getLogger}             from "@log4js-node/log4js-api"
import {UntilElementCondition} from "../../../driver/lib/element/ElementConditions";

export class Wait implements Interaction<void, void> {
    private logger = getLogger(`Wait`);
    private condition: UntilElementCondition;

    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`wait for '<<awaitingElement>>' and check '<<condition>>'.`)
    public performAs(actor: UsesAbilities): Promise<void> {

        return new Promise((resolve, reject): void => {
            WaitOnElements.as(actor).wait(this.condition, this.awaitingElement)
                .then((message: string): void => {
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
    public static for(awaitingElement: SppWebElementFinder): Wait {
        return new Wait(awaitingElement);
    }

    /**
     * specify the condition to wait for of the given element
     * @param condition the condition to be waiting for
     */
    public andCheck(condition: UntilElementCondition): Wait {
        this.condition = condition;
        return this;
    }

    /**
     * @ignore
     */
    private constructor(private awaitingElement: SppWebElementFinder) {}


}