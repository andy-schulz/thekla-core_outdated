import {UsesAbilities}                     from "../../Actor";
import {Interaction}                       from "../../lib/actions/Activities";
import {stepDetails}                       from "../../lib/decorators/StepDecorators";
import {UseTheRestApi}                     from "../abilities/UseTheRestApi";
import {SppRestRequest}                    from "../SppRestRequests";
import {catchAndSaveOnError, safeResponse} from "./0_helper";

export class Delete implements Interaction {
    private safeTo: (result: any) => void;
    private catchError =  false;

    public static from(request: SppRestRequest): Delete {
        return new Delete(request);
    }

    constructor(private request: SppRestRequest) {
    }

    andSaveResult(safeTo: (result: any) => void) {
        this.safeTo = safeTo;
        return this;
    }

    dontFailInCaseOfAnError() {
        this.catchError = true;
        return this;
    }

    @stepDetails<UsesAbilities>(`send a delete request for: '<<request>>'`)
    performAs(actor: UsesAbilities): Promise<void> {
        return UseTheRestApi.as(actor).send(this.request).post()
            .then(safeResponse(this.safeTo))
            .catch(catchAndSaveOnError(this.safeTo, this.catchError))
    }
}