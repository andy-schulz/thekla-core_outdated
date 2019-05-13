import {UsesAbilities}                                    from "../../Actor";
import {Interaction}                                      from "../../lib/actions/Activities";
import {stepDetails}                                      from "../../lib/decorators/StepDecorators";
import {UseTheRestApi}                                    from "../abilities/UseTheRestApi";
import {SppRestRequest}                                   from "../SppRestRequests";
import {catchAndSaveOnError, MethodActions, safeResponse} from "./0_helper";

export class Delete implements Interaction, MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private safeTo: (result: any) => void;
    private catchError =  false;

    public static from(request: SppRestRequest): Delete {
        return new Delete(request);
    }

    private constructor(private request: SppRestRequest) {
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public andSaveResponse(safeTo: (result: any[]) => void): Delete {
        this.safeTo = safeTo;
        return this;
    }

    public dontFailInCaseOfAnError(): Delete {
        this.catchError = true;
        return this;
    }

    @stepDetails<UsesAbilities>(`send a delete request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return UseTheRestApi.as(actor).send(this.request).post()
            .then(safeResponse(this.safeTo))
            .catch(catchAndSaveOnError(this.safeTo, this.catchError))
    }
}