export class Utils {
    public static wait(timeToWait: number): Promise<string> {
        return new Promise((fulfill): void => {
            setTimeout((): void => {
                fulfill(`Time waited: ${timeToWait}`)
            }, timeToWait);
        })
    }
}

export const funcToString = (func: Function | string) => {
    return `return (${func}).apply(null, arguments);`
}

export const tkDebug = (message: string): (pr: Promise<any>) => Promise<any> => {
    return (pr: Promise<any>): any => {
        return pr.then((value: any) => {
            console.debug(`DEBUG: ${message}: value: ${value}`);
            debugger;
            return value;
        })
    }
};