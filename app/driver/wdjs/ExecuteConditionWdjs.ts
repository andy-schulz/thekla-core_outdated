import {TkWebElement}                                         from "../interface/TkWebElement";
import {WebElementFinder}                                     from "../interface/WebElements";
import {EnabledCheck, UntilElementCondition, VisibilityCheck} from "../lib/element/ElementConditions";

export class ExecuteConditionWdjs {

    public static execute (condition: UntilElementCondition, element: TkWebElement | WebElementFinder): Promise<boolean> {
        switch (condition.waiter.constructor) {
            case VisibilityCheck:
                return element.isDisplayed()
                    .then(condition.modifierFunc);
            case EnabledCheck:
                return element.isEnabled()
                    .then(condition.modifierFunc);
            default:
                return Promise.reject(`No Action for Condition ${condition.waiter.constructor.name}`)
        }
    }
}