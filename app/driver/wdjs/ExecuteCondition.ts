import {WebElementFinder}                                     from "../interface/WebElements";
import {EnabledCheck, UntilElementCondition, VisibilityCheck} from "../lib/ElementConditions";
import {WdElement}                                            from "./interfaces/WdElement";

export class ExecuteCondition {
    public static execute (condition: UntilElementCondition, element: WdElement | WebElementFinder): Promise<boolean> {
        switch (condition.waiter.constructor) {
            case VisibilityCheck:
                return new Promise((fulfill, reject) => {
                    element.isDisplayed()
                        .then(condition.negate)
                        .then(fulfill)
                        .catch(reject)
                });
            case EnabledCheck:
                return new Promise((fulfill, reject) => {
                    element.isEnabled()
                        .then(condition.negate)
                        .then(fulfill)
                        .catch(reject)
                });
            default:
                return Promise.reject(`No Action for Condition ${condition.waiter.constructor.name}`)
        }
    }
}