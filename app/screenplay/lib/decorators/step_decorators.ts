import {getLogger, Logger}    from "@log4js-node/log4js-api";
import {Activity}             from "../../..";
import {ActivityLogEntryType} from "../../../packages/ActivityLog/ActivityLogEntry";
import {LogsActivity}         from "../../Actor";
import {stringReplace}        from "./decoratorStrings";

const createLogTask = <U extends LogsActivity, PT, RT>(
    description: string,
    activityDetails: string,
    activityType: ActivityLogEntryType) => {
    return function logTask(
        target: Activity<PT, RT>,
        propertyName: string,
        propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>): PropertyDescriptor {
        const logger: Logger = getLogger(target.constructor.name);
        const method = propertyDesciptor.value as () => Promise<RT>;

        target.toString = stringReplace(description);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // propertyDesciptor.value = function (...args: any): Promise<RT> {
        propertyDesciptor.value = function (actor: U, param?: PT): Promise<RT> {

            const logEntry = actor.activityLog.addActivityLogEntry(target.constructor.name,
                `${actor.name} ${activityDetails} ${this.toString()}`,
                activityType);
            // @ts-ignore
            if (typeof logger.stepdetails == `function`) {
                // @ts-ignore
                logger.stepdetails(`${actor.name} ${activityDetails} ${this.toString()}`);
            } else {
                logger.debug(`${actor.name} ${activityDetails} ${this.toString()}`);
            }
            const arg = [actor, param];
            return method.apply(this, arg as [])
                .then((value: RT): RT => {
                    actor.activityLog.reset(logEntry);
                    return value;
                });
        };

        return propertyDesciptor;
    }
};

export function stepDetails<U extends LogsActivity, PT, RT>(text: string): (
    target: Activity<PT, RT>,
    propertyName: string,
    propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>) => PropertyDescriptor {

    return createLogTask(text, `attempts to`, `Interaction`)
}

export function skip<U extends LogsActivity, PT, RT>(text: string): (
    target: Activity<PT, RT>,
    propertyName: string,
    propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>) => PropertyDescriptor {

    return createLogTask(text, `skips`, `Task`);
}

export function step<U extends LogsActivity, PT, RT>(text: string): (
    target: Activity<PT, RT>,
    propertyName: string,
    propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>) => PropertyDescriptor {

    return createLogTask(text, `attempts to`, `Task`);
}