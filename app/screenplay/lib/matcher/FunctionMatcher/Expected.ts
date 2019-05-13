import {AssertionError, strictEqual} from "assert";
import {curryRight, curry}           from "lodash";
import {diff}                        from 'deep-diff';

/**
 * curried strictEqual to pass a function with the value to compare to the See.if Question
 */

export const Expected = {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toBe: curryRight((actual: any, expected: any): boolean => {
        strictEqual(actual, expected);
        return true;
    }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toEqual: curryRight((actual: any, expected: any): boolean => {
        strictEqual(actual, expected);
        return true;
    }),

    toMatch: curryRight((actual: string, expectedRegExp: RegExp): boolean => {
        const match = actual.match(expectedRegExp);

        if(match === null) {
            throw new AssertionError({
                message: `'${actual}' does not match the given RegExp ${expectedRegExp}`,
                actual: actual,
                expected: expectedRegExp,
                operator: `match`
            })
        } else {
            return true;
        }
    }),


    /**
     * checks if the expected object is contained within the actual object
     * this way a subset of attributes can be checked
     */
    toContain: curry((expected: Record<string, any> | string, actual: Record<string, any> | string): boolean => {
        const exp = typeof expected === `string` ? JSON.parse(expected) : expected;
        const act = typeof actual === `string` ? JSON.parse(actual) : actual;


        const preFilter = (path: string[], key: string): boolean => {
            let filter = false;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const reducer = (acc: { [key: string]: any }, current: string): object => {
                if (filter || acc[current] === undefined) {
                    filter = true;
                }
                return acc[current]
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            throw new Error(`Differences in objects found: ${JSON.stringify(theDiff, null, `\t`)}`);
        }
    })
};

