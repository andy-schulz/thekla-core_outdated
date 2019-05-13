import {curry} from "lodash";

export const safeResponse = curry(function(safeTo: (result: any) => void, result: any): void { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (safeTo)
        safeTo(result);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const catchAndSaveOnError = curry((safeTo: (result: any) => void, catchError: boolean, e: any): Promise<void> => {
    safeResponse(safeTo, e);

    if(catchError)
        return Promise.resolve();
    return Promise.reject(e)
});

export interface MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    andSaveResponse(safeTo: (result: any) => void): MethodActions;
    dontFailInCaseOfAnError(): MethodActions;
}