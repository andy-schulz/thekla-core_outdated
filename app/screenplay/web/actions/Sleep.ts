import {Interaction}   from "../../lib/actions/Activities";
import {UsesAbilities} from "../../Actor";
import {Utils}         from "../../../driver/utils/Utils";
import {getLogger}     from "@log4js-node/log4js-api"
import {stepDetails}   from "../../lib/decorators/StepDecorators";

export class Sleep implements Interaction {
    private logger = getLogger(`Sleep`);

    public static for(sleepTime: number): Sleep {
        return new Sleep(sleepTime);
    }

    private constructor(private sleepTime: number) {
    }

    @stepDetails<UsesAbilities>(`wait for '<<url>>' ms`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return Utils.wait(this.sleepTime).then((): void => {
            return this.logger.trace(`Slept for ${this.sleepTime}`);
        });
    }
}