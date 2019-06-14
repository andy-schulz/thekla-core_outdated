
import {getLogger, Logger}      from "@log4js-node/log4js-api";

import {Activity} from "../../..";
import {stringReplace}          from "./decoratorStrings";

export function stepDetails<U, PT, RT>(text: string): (
    target: Activity<PT,RT>,
    propertyName: string,
    propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>) => PropertyDescriptor {

    return function logTask(
        target: Activity<PT,RT>,
        propertyName: string,
        propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>): PropertyDescriptor {
        const logger: Logger = getLogger(target.constructor.name);

        const method = propertyDesciptor.value as () => Promise<RT>;

        target.toString = stringReplace(text);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        propertyDesciptor.value = function (...args: any): Promise<RT> {
            // @ts-ignore
            if(typeof logger.stepdetails == `function`) {
                // @ts-ignore
                logger.stepdetails(`${args[0].name} attempts to ${this.toString()}`);
            } else {
                logger.debug(`${args[0].name} attempts to ${this.toString()}`);
            }

            return method.apply(this, args);
        };

        return propertyDesciptor;
    }
}

export function skip<U, PT, RT>(text: string): (
    target: Activity<PT,RT>,
    propertyName: string,
    propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>) => PropertyDescriptor {

    return function logTask(
        target: Activity<PT,RT>,
        propertyName: string,
        propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>): PropertyDescriptor {
        const logger: Logger = getLogger(target.constructor.name);

        const method = propertyDesciptor.value as () => Promise<RT>;

        target.toString = stringReplace(text);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        propertyDesciptor.value = function (...args: any): Promise<RT> {
            // @ts-ignore
            if(typeof logger.stepdetails == `function`) {
                // @ts-ignore
                logger.stepdetails(`${args[0].name} skips ${this.toString()}`);
            } else {
                logger.debug(`${args[0].name} skips ${this.toString()}`);
            }

            return method.apply(this, args);
        };

        return propertyDesciptor;
    }
}

export function step<U,PT,RT>(text: string): (
    target: Activity<PT,RT>,
    propertyName: string,
    propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>) => PropertyDescriptor {

    return function logTask(
        target: Activity<PT,RT>,
        propertyName: string,
        propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>): PropertyDescriptor {
        const logger = getLogger(target.constructor.name);

        const method = propertyDesciptor.value as () => Promise<RT>;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        propertyDesciptor.value = function (...args: any): Promise<RT> {

            // @ts-ignore
            if(typeof logger.step == `function`) {
                // @ts-ignore
                logger.step(`${args[0].name} attempts to ${text}`);
            } else {
                logger.debug(`${args[0].name} attempts to ${text}`);
            }

            return method.apply(this, args);
        };
        return propertyDesciptor;
    }
}