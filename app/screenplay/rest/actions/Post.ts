import {UsesAbilities}                                    from "../../Actor";
import {Interaction}                                      from "../../lib/actions/Activities";
import {stepDetails}                                      from "../../lib/decorators/StepDecorators";
import {UseTheRestApi}                                    from "../abilities/UseTheRestApi";
import {SppRestRequest}                                   from "../SppRestRequests";
import {catchAndSaveOnError, MethodActions, safeResponse} from "./0_helper";

export class Post implements Interaction, MethodActions {
    private safeTo: (result: any) => void;
    private catchError =  false;

    public static to(request: SppRestRequest): Post {
        return new Post(request);
    }

    constructor(private request: SppRestRequest) {
    }

    andSaveResponse(safeTo: (result: any[]) => void): Post {
        this.safeTo = safeTo;
        return this;
    }

    dontFailInCaseOfAnError(): Post {
        this.catchError = true;
        return this;
    }

    @stepDetails<UsesAbilities>(`send a post request for: '<<request>>'`)
    performAs(actor: UsesAbilities): Promise<void> {
        return UseTheRestApi.as(actor).send(this.request).post()
            .then(safeResponse(this.safeTo))
            .catch(catchAndSaveOnError(this.safeTo, this.catchError))
    }
}