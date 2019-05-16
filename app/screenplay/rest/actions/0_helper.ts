import {curry} from "lodash";

export const saveResponse = curry(function(saveTo: (result: any) => void, result: any): void { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (saveTo)
        saveTo(result);
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