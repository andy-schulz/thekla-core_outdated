import {UntilElement}                           from "../..";
import {UntilElementCondition, VisibilityCheck} from "../lib/ElementConditions";
import {WdElement}                              from "./interfaces/WdElement";

export class UntilElementWdjs {
    public static execute (condition: UntilElementCondition, element: WdElement): Promise<boolean> {
        switch (condition.waiter.constructor) {
            case VisibilityCheck:
                return UntilElementWdjs.isVisible(element);
            default:
                return Promise.reject(`No Action for Condition ${condition.waiter.constructor.name}`)
        }
    }

    public static isVisible(elem: WdElement): Promise<boolean> {
        return new Promise((fulfill, reject) => {
            elem.isDisplayed()
                .then(status => fulfill(status))
                .catch(e => reject(e))
        })
    }
}