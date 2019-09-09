import {ActivityLogNode} from "./ActivityLogEntry";

export const formatLogWithPrefix = (logPrefix: string = ``, repeat: number, logNode: ActivityLogNode): string => {
    return `${logPrefix.repeat(repeat)}[${logNode.name}] - ${logNode.description}${(logNode.activityNodes.map((logEntry: ActivityLogNode): string => {
        return `\n` + formatLogWithPrefix(`${logPrefix}`, repeat + 1, logEntry)
    })).join(``)}`
};