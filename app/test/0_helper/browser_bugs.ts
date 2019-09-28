import {parseBrowserVersion} from "../../driver/lib/client/client_utils";
import { Logger } from "log4js";

export const checkForFireFoxCyclicError = (
    browserName: string,
    browserVersion: string,
    e: Error,
    logger: Logger,
    testId: string): Promise<void> => {
    // check for bug in firefox < 62
    const {major: browserMajorVersion} = parseBrowserVersion(browserVersion);

    if (browserName === `firefox` &&
        browserMajorVersion > 58 && browserMajorVersion < 62 &&
        e.name === `javascript error` &&
        e.message === `TypeError: cyclic object value`) {

        logger.debug(`Bug in FF version < 62 encountered ... ignoring for now. 
                        Not using FF version < 62? Check test case with id: ${testId}`);
        return Promise.resolve();
    }
    return Promise.reject(e)
};