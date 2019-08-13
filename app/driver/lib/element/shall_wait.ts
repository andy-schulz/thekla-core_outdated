import {Browser}               from "../../interface/Browser";
import {TkWebElement}          from "../../interface/TkWebElement";
import {ExecuteConditionWdjs}  from "../../wdjs/ExecuteConditionWdjs";
import {until}                 from "../Condition";
import {UntilElementCondition} from "./ElementConditions";
import { Logger } from "@log4js-node/log4js-api";

export const waitForCondition = (
    browser: Browser,
    getElements: () => Promise<TkWebElement[]>,
    waitMessage: string,
    locatorString: string,
    logger: Logger): ( condition: UntilElementCondition) => Promise<TkWebElement[]> => {

    let elements: TkWebElement[] = [];

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
                return ExecuteConditionWdjs.execute(condition, elem);
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


    return ( condition: UntilElementCondition): Promise<TkWebElement[]> => {
        return browser.wait(until(createLoop(condition)), condition.timeout, waitMessage)
            .then((): TkWebElement[] => elements)
    }
};