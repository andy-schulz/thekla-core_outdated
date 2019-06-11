import {RestClientConfig}  from "../../../config/RestClientConfig";
import {RestRequestResult} from "../../../rest/interface/RestRequestResult";
import {UsesAbilities}     from "../../Actor";
import {Interaction}       from "../../lib/actions/Activities";
import {stepDetails}       from "../../lib/decorators/step_decorators";
import {UseTheRestApi}     from "../abilities/UseTheRestApi";
import {SppRestRequest}    from "../SppRestRequests";
import {catchAndSaveOnError, MethodActions, saveResponse, SaveToFn} from "./0_helper";

export class Post implements Interaction<void, RestRequestResult>, MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private saveTo: (result: any) => void;
    private catchError =  false;
    private config: RestClientConfig | undefined;

    @stepDetails<UsesAbilities, void, RestRequestResult>(`send a post request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<RestRequestResult> {
        return UseTheRestApi.as(actor).send(this.request).post(this.config)
            .then(saveResponse(this.saveTo))
            .catch(catchAndSaveOnError(this.saveTo, this.catchError))
    }


    public static to(request: SppRestRequest): Post {
        return new Post(request);
    }

    public withConfig(config: RestClientConfig): Post {
        this.config = config;
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public andSaveResponse(saveTo: SaveToFn): Post {
        this.saveTo = saveTo;
        return this;
    }

    public dontFailInCaseOfAnError(): Post {
        this.catchError = true;
        return this;
    }

    private constructor(private request: SppRestRequest) {
    }
}