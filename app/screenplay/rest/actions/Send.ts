import {RequestMethod}                                    from "../../../rest/lib/Method";
import {UsesAbilities}                                    from "../../Actor";
import {Interaction}                                      from "../../lib/actions/Activities";
import {stepDetails}                                      from "../../lib/decorators/StepDecorators";
import {UseTheRestApi}                                    from "../abilities/UseTheRestApi";
import {SppRestRequest}                                   from "../SppRestRequests";
import {catchAndSaveOnError, MethodActions, safeResponse} from "./0_helper";

export class Send implements Interaction, MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private safeTo: (result: any) => void;
    private catchError =  false;
    private method: RequestMethod;

    public static the(request: SppRestRequest): Send {
        return new Send(request);
    }

    private constructor(private request: SppRestRequest) {
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public andSaveResponse(safeTo: (result: any[]) => void): Send {
        this.safeTo = safeTo;
        return this;
    }

    public dontFailInCaseOfAnError(): Send {
        this.catchError = true;
        return this;
    }

    public as(method: RequestMethod): Send {
        this.method = method;
        return this;
    }

    @stepDetails<UsesAbilities>(`send a get request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return this.method.send(UseTheRestApi.as(actor).send(this.request))
            .then(safeResponse(this.safeTo))
            .catch(catchAndSaveOnError(this.safeTo, this.catchError))
    }
}