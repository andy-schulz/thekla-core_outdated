import {ActivityLogNode} from "./ActivityLogEntry";
import * as _            from "lodash";

export const formatLogWithPrefix = (logPrefix: string = ``): (repeat: number) => (logNode: ActivityLogNode) => string => {

    return (repeat: number): (logNode: ActivityLogNode) => string => {
        return (logNode: ActivityLogNode): string => {
            return `${logPrefix.repeat(repeat)}[${logNode.name}] - ${logNode.description}${(logNode.activityNodes.map((logEntry: ActivityLogNode): string => {

                return `\n` + formatLogWithPrefix(`${logPrefix}`)(repeat + 1)(logEntry)

            })).join(``)}`
        }
    }
};

export const encodeLog = (encoding: string = ``): (source: string) => string => {
    return (source: string): string => {
        if(!encoding)
            return source;

        return new Buffer(source).toString(encoding)
    }
};