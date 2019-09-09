import {getLogger, Logger} from "@log4js-node/log4js-api";
import {Activity}          from "../../..";
import {LogsActivity}      from "../../Actor";
import {stringReplace}     from "./decoratorStrings";

export function stepDetails<U extends LogsActivity, PT, RT>(text: string): (
    target: Activity<PT, RT>,
    propertyName: string,
    propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>) => PropertyDescriptor {

    return function logTask(
        target: Activity<PT, RT>,
        propertyName: string,
        propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>): PropertyDescriptor {
        const logger: Logger = getLogger(target.constructor.name);

        const method = propertyDesciptor.value as () => Promise<RT>;

        target.toString = stringReplace(text);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // propertyDesciptor.value = function (...args: any): Promise<RT> {
        propertyDesciptor.value = function (actor: U, param?: PT): Promise<RT> {

            const logEntry = actor.activityLog.addActivityLogEntry(target.constructor.name,
                `${actor.name} attempts to ${this.toString()}`,
                `Interaction`);
            // @ts-ignore
            if (typeof logger.stepdetails == `function`) {
                // @ts-ignore
                logger.stepdetails(`${actor.name} attempts to ${this.toString()}`);
            } else {
                logger.debug(`${actor.name} attempts to ${this.toString()}`);
            }
            const arg = [actor, param];
            return method.apply(this, arg as [])
                .then((value: RT) => {
                    actor.activityLog.reset(logEntry);
                    return value;
                });
        };

        return propertyDesciptor;
    }
}

export function skip<U extends LogsActivity, PT, RT>(text: string): (
    target: Activity<PT, RT>,
    propertyName: string,
    propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>) => PropertyDescriptor {

    return function logTask(
        target: Activity<PT, RT>,
        propertyName: string,
        propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>): PropertyDescriptor {
        const logger: Logger = getLogger(target.constructor.name);

        const method = propertyDesciptor.value as () => Promise<RT>;

        target.toString = stringReplace(text);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // propertyDesciptor.value = function (...args: any): Promise<RT> {
        propertyDesciptor.value = function (actor: U, param?: PT): Promise<RT> {
            const logEntry = actor.activityLog.addActivityLogEntry(
                target.constructor.name,
                `${actor.name} skips ${this.toString()}`,
                `Task`
            );
            // @ts-ignore
            if (typeof logger.stepdetails == `function`) {
                // @ts-ignore
                logger.stepdetails(`${actor.name} skips ${this.toString()}`);
            } else {
                logger.debug(`${actor.name} skips ${this.toString()}`);
            }
            const args = [actor, param];
            return method.apply(this, args as  [])
                .then((value: RT) => {
                    actor.activityLog.reset(logEntry);
                    return value;
                });
        };

        return propertyDesciptor;
    }
}

export function step<U extends LogsActivity, PT, RT>(text: string): (
    target: Activity<PT, RT>,
    propertyName: string,
    propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>) => PropertyDescriptor {

    return function logTask(
        target: Activity<PT, RT>,
        propertyName: string,
        propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>): PropertyDescriptor {
        const logger = getLogger(target.constructor.name);

        const method = propertyDesciptor.value as () => Promise<RT>;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // propertyDesciptor.value = function (...args: any): Promise<RT> {
        propertyDesciptor.value = function (actor: U, param?: PT): Promise<RT> {
            const logEntry = actor.activityLog.addActivityLogEntry(target.constructor.name,
                `${actor.name} attempts to ${text}`,
                `Task`);
            // @ts-ignore
            if (typeof logger.step == `function`) {
                // @ts-ignore
                logger.step(`${actor.name} attempts to ${text}`);
            } else {
                logger.debug(`${actor.name} attempts to ${text}`);
            }
            const args = [actor, param];
            return method.apply(this, args as [])
                .then((value: RT) => {
                    actor.activityLog.reset(logEntry);
                    return value;
                });
        };
        return propertyDesciptor;
    }
}