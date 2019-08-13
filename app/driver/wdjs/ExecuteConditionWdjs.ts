import {WebElementFinder}                                     from "../interface/WebElements";
import {EnabledCheck, UntilElementCondition, VisibilityCheck} from "../lib/element/ElementConditions";
import {WebElementJS}                                         from "./wrapper/WedElementJS";

export class ExecuteConditionWdjs {
    public static execute (condition: UntilElementCondition, element: WebElementJS | WebElementFinder): Promise<boolean> {
        switch (condition.waiter.constructor) {
            case VisibilityCheck:
                return element.isDisplayed()
                    .then(condition.negate);
            case EnabledCheck:
                return element.isEnabled()
                    .then(condition.negate);
            default:
                return Promise.reject(`No Action for Condition ${condition.waiter.constructor.name}`)
        }
    }
}