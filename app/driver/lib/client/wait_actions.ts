import {Condition} from "../Condition";
import { Logger } from "@log4js-node/log4js-api";

export const waitForCondition = (logger: Logger) => {
    return (
        condition: Condition,
        timeout: number = 5000,
        waitMessage: string = ``): Promise<string> => {

        return new Promise((fulfill, reject): void => {
            const start = Date.now();
            const check = (): void => {
                const worker = (workerState: boolean, error?: string): void => {
                    const timeSpendWaiting = Date.now() - start;
                    if (timeSpendWaiting > timeout) {
                        const message = `Wait timed out after ${timeout} ms${waitMessage ? ` -> (` + waitMessage + `).` : `.`}`;
                        logger.trace(message);
                        reject(message);
                        return;
                    }
                    if (workerState) {
                        const message = `Wait successful ${waitMessage ? ` -> (` + waitMessage + `)` : ``} after ${timeSpendWaiting} ms.`;
                        logger.trace(message);
                        fulfill(message);
                        return;
                    } else {
                        setTimeout(check, 300);
                    }
                };

                condition.check()
                    .then(worker)
                    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .catch((e: any): void => worker(false, `${e.toString()} \n ${Error().stack}`))
            };
            setTimeout(check, 300);
        })
    }
};
