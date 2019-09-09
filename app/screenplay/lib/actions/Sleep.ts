import {Interaction}   from "./Activities";
import {UsesAbilities} from "../../Actor";
import {Utils}         from "../../../driver/utils/Utils";
import {getLogger}     from "@log4js-node/log4js-api"
import {stepDetails}   from "../decorators/step_decorators";

export class Sleep implements Interaction<void, void> {
    private logger = getLogger(`Sleep`);

    public static for(sleepTime: number): Sleep {
        return new Sleep(sleepTime);
    }

    private constructor(private sleepTime: number) {
    }

    @stepDetails<UsesAbilities, void, void>(`stop all actions for '<<sleepTime>>' ms`)
    // parameter is needed for stepDetails typing
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public performAs(actor: UsesAbilities): Promise<void> {
        return Utils.wait(this.sleepTime).then((): void => {
            return this.logger.trace(`Slept for ${this.sleepTime}`);
        });
    }
}