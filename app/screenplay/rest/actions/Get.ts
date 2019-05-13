import {UsesAbilities}                                    from "../../Actor";
import {Interaction}                                      from "../../lib/actions/Activities";
import {stepDetails}                                      from "../../lib/decorators/StepDecorators";
import {UseTheRestApi}                                    from "../abilities/UseTheRestApi";
import {SppRestRequest}                                   from "../SppRestRequests";
import {catchAndSaveOnError, MethodActions, safeResponse} from "./0_helper";

export class Get implements Interaction, MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private safeTo: (result: any) => void;
    private catchError =  false;

    public static from(request: SppRestRequest): Get {
        return new Get(request);
    }

    private constructor(private request: SppRestRequest) {
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public andSaveResponse(safeTo: (result: any[]) => void): Get {
        this.safeTo = safeTo;
        return this;
    }

    public dontFailInCaseOfAnError(): Get {
        this.catchError = true;
        return this;
    }

    @stepDetails<UsesAbilities>(`send a get request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return UseTheRestApi.as(actor).send(this.request).get()
            .then(safeResponse(this.safeTo))
            .catch(catchAndSaveOnError(this.safeTo, this.catchError))
    }
}