import {curry} from "lodash";

export const safeResponse = curry(function(safeTo: (result: any) => void, result: any) {
    if (safeTo)
        safeTo(result);
});

export const catchAndSaveOnError = curry((safeTo: (result: any) => void, catchError: boolean, e: any) => {
    safeResponse(safeTo, e);

    if(catchError)
        return Promise.resolve();
    return Promise.reject(e)
});