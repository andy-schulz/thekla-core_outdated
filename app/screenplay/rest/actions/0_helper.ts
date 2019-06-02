import {curry} from "lodash";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SaveToFn = (result: any) => void

export const saveResponse = curry(function(saveTo: SaveToFn, result: any): any { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (saveTo)
        saveTo(result);
    return result;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const catchAndSaveOnError = curry((saveTo: (result: any) => void, catchError: boolean, e: any): Promise<void> => {
    saveResponse(saveTo, e);

    if(catchError)
        return Promise.resolve();
    return Promise.reject(e)
});

export interface MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    andSaveResponse(saveTo: (result: any) => void): MethodActions;
    dontFailInCaseOfAnError(): MethodActions;
}