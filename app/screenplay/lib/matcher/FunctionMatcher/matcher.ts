import {strictEqual as se} from "assert";
import {curryRight, curry} from "lodash";
import {diff}              from 'deep-diff';

/**
 * curried strictEqual to pass a function with the value to compare to the See.if Question
 */
export const strictEqual = curryRight(se);

/**
 * checks if the expected object is contained within the actual object
 * this way a subset of attributes can be checked
 */
export const objectContains = curry((expected: Object | string, actual: Object | string): boolean => {
    const exp = typeof expected === "string" ? JSON.parse(expected) : expected;
    const act = typeof actual === "string" ? JSON.parse(actual) : actual;


    const preFilter = (path: string[], key: string) => {
        let filter = false;

        const reducer = (acc: { [key: string]: any }, current: string): object => {
            if (filter || acc[current] === undefined) {
                filter = true;
            }
            return acc[current]
        };

        const obj: { [key: string]: any } = path.reduce(reducer, exp);

        if (filter) {
            return filter;
        }

        return obj[key] === undefined;
    };

    const theDiff = diff(act, exp, preFilter);
    if (theDiff === undefined) {
        return true
    } else {
        throw new Error(`Differences in Case Response found: ${JSON.stringify(theDiff, null, "\t")}`);
    }
});