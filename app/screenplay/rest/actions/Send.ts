import {RestClientConfig}                                 from "../../../config/RestClientConfig";
import {RequestMethod}                                    from "../../../rest/lib/Method";
import {UsesAbilities}                                              from "../../Actor";
import {Interaction}                                                from "../../lib/actions/Activities";
import {stepDetails}                                                from "../../lib/decorators/StepDecorators";
import {UseTheRestApi}                                              from "../abilities/UseTheRestApi";
import {SppRestRequest}                                             from "../SppRestRequests";
import {catchAndSaveOnError, MethodActions, saveResponse, SaveToFn} from "./0_helper";

export class Send implements Interaction, MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private saveTo: (result: any) => void;
    private catchError =  false;
    private method: RequestMethod;
    private config: RestClientConfig | undefined;

    @stepDetails<UsesAbilities>(`send a get request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return this.method.send(UseTheRestApi.as(actor).send(this.request), this.config)
            .then(saveResponse(this.saveTo))
            .catch(catchAndSaveOnError(this.saveTo, this.catchError))
    }

    public static the(request: SppRestRequest): Send {
        return new Send(request);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public andSaveResponse(saveTo: SaveToFn): Send {
        this.saveTo = saveTo;
        return this;
    }

    public withConfig(config: RestClientConfig) {
        this.config = config;
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

    private constructor(private request: SppRestRequest) {
    }
}