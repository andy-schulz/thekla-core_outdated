
import {getLogger, Logger}      from "@log4js-node/log4js-api";

import {Activity} from "../../..";
import {stringReplace}          from "./decoratorStrings";

export function stepDetails<U>(text: string) {

    return function logTask(
        target: Activity,
        propertyName: string,
        propertyDesciptor: TypedPropertyDescriptor<((actor: U) => Promise<void>)>): PropertyDescriptor {
        const logger: Logger = getLogger(target.constructor.name);

        const method = propertyDesciptor.value as () => Promise<void>;

        target.toString = stringReplace(text);

        propertyDesciptor.value = function (...args: any) {
            // @ts-ignore
            if(typeof logger.stepdetails == "function") {
                // @ts-ignore
                logger.stepdetails(`${args[0].name} attempts to ${this.toString()}`);
            } else {
                logger.debug(`${args[0].name} attempts to ${this.toString()}`);
            }

            const result = method.apply(this, args);
            return result;
        };

        return propertyDesciptor;
    }
}

export function step<U>(text: string) {

    return function logTask(
        target: Activity,
        propertyName: string,
        propertyDesciptor: TypedPropertyDescriptor<((actor: U) => Promise<void>)>): PropertyDescriptor {
        const logger = getLogger(target.constructor.name);

        const method = propertyDesciptor.value as () => Promise<void>;

        propertyDesciptor.value = function (...args: any) {

            // @ts-ignore
            if(typeof logger.step == "function") {
                // @ts-ignore
                logger.step(`${args[0].name} attempts to ${text}`);
            } else {
                logger.debug(`${args[0].name} attempts to ${text}`);
            }

            const result = method.apply(this, args);
            return result;
        };
        return propertyDesciptor;
    }
}