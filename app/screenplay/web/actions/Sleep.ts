import {Interaction}           from "../../lib/actions/Activities";
import {Actor}                 from "../../Actor";
import {Utils}                 from "../../../driver/utils/Utils";
import {getLogger}             from "@log4js-node/log4js-api"

export class Sleep implements Interaction {
    private logger = getLogger("Sleep");

    public static for(sleepTime: number) {
        return new Sleep(sleepTime);
    }

    constructor(private sleepTime: number) {}

    performAs(actor: Actor): Promise<void> {
        return Utils.wait(this.sleepTime).then((message: any) => {
            return this.logger.trace(`Slept for ${this.sleepTime}`);
        });
    }
}