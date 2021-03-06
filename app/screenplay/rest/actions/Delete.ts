import {RestRequestResult} from "../../../rest/interface/RestRequestResult";
import {UsesAbilities}     from "../../Actor";
import {Interaction}       from "../../lib/actions/Activities";
import {stepDetails}       from "../../lib/decorators/step_decorators";
import {UseTheRestApi}     from "../abilities/UseTheRestApi";
import {SppRestRequest}    from "../SppRestRequests";
import {catchAndSaveOnError, MethodActions, saveResponse, SaveToFn} from "./0_helper";

export class Delete implements Interaction<void, RestRequestResult>, MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private saveTo: (result: any) => void;
    private catchError =  false;

    public static from(request: SppRestRequest): Delete {
        return new Delete(request);
    }

    private constructor(private request: SppRestRequest) {
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public andSaveResponse(saveTo: SaveToFn): Delete {
        this.saveTo = saveTo;
        return this;
    }

    public dontFailInCaseOfAnError(): Delete {
        this.catchError = true;
        return this;
    }

    @stepDetails<UsesAbilities, void, RestRequestResult>(`send a delete request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<RestRequestResult> {
        return UseTheRestApi.as(actor).send(this.request).post()
            .then(saveResponse(this.saveTo))
            .catch(catchAndSaveOnError(this.saveTo, this.catchError))
    }
}