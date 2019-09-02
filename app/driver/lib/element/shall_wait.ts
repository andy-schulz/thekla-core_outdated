import {Browser}                                              from "../../interface/Browser";
import {TkWebElement}                                         from "../../interface/TkWebElement";
import {until}                                                from "../Condition";
import {EnabledCheck, UntilElementCondition, VisibilityCheck} from "./ElementConditions";
import { Logger }                                             from "@log4js-node/log4js-api";
import { WebElementFinder }                                   from "../../..";

const execute = <WD>(condition: UntilElementCondition, element: TkWebElement<WD> | WebElementFinder): Promise<boolean> => {
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
};

export const waitForCondition = <WD>(
    browser: Browser,
    getElements: () => Promise<TkWebElement<WD>[]>,
    waitMessage: string,
    locatorString: string,
    logger: Logger): ( condition: UntilElementCondition) => Promise<TkWebElement<WD>[]> => {

    let elements: TkWebElement<WD>[] = [];

    const createLoop = (condition: UntilElementCondition): () => Promise<boolean> => {
        return async (): Promise<boolean> => {
            elements = await getElements();
            if (logger.isTraceEnabled()) {
                logger.trace(`LOOP CONDITIONS(${condition.conditionHelpText}): shallWait: ${elements.length} element(s) found for locator ${locatorString}`);
            }

            if (elements.length === 0) {
                logger.trace(`LOOP CONDITIONS(${condition.conditionHelpText}): no elements found. Exiting with false.`);
                return Promise.resolve(false)
            }

            // apply the condition to each element -> arr.map()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const applyCondition = async (elem: any): Promise<boolean> => {

                // extra log level check to prevent getAttribute() evaluation
                if (logger.isTraceEnabled()) {
                    logger.trace(`LOOP CONDITIONS(${condition.conditionHelpText}): outerHTML: ${await elem.getAttribute(`outerHTML`)}`);
                    logger.trace(`LOOP CONDITIONS(${condition.conditionHelpText}): innerHTML: ${await elem.getAttribute(`innerHTML`)}`);
                }
                return execute(condition, elem);
            };

            const arr: Promise<boolean>[] = elements.map(applyCondition);
            return Promise.all(arr)
                .then((arr: boolean[]): Promise<boolean> => {
                    logger.trace(`LOOP CONDITIONS(${condition.conditionHelpText}): shallWait result: ${arr.length} for locator ${locatorString}`);
                    return Promise.resolve(arr.some((b): boolean => b))
                })
                .catch((e: Error): Promise<boolean> => {
                    logger.trace(`LOOP CONDITIONS(${condition.conditionHelpText}): Error executing condition in loop: ${e.name} for locator: ${locatorString}`);
                    return Promise.reject(e)
                })
        }
    };

    return ( condition: UntilElementCondition): Promise<TkWebElement<WD>[]> => {
        return browser.wait(until(createLoop(condition)), condition.timeout, waitMessage)
            .then((): TkWebElement<WD>[] => elements)
    }
};