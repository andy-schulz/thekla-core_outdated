import {RestClientConfig}                                           from "../../../config/RestClientConfig";
import {RequestMethod}                                              from "../../../rest/lib/Method";
import {UsesAbilities}                                              from "../../Actor";
import {Interaction}                                                from "../../lib/actions/Activities";
import {stepDetails}                                                from "../../lib/decorators/StepDecorators";
import {UseTheRestApi}                                              from "../abilities/UseTheRestApi";
import {SppRestRequest}                                             from "../SppRestRequests";
import {catchAndSaveOnError, MethodActions, saveResponse, SaveToFn} from "./0_helper";

class SendHelper implements Interaction, MethodActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private saveTo: (result: any) => void;
    private catchError =  false;
    private config: RestClientConfig | undefined;

    @stepDetails<UsesAbilities>(`send a get request for: '<<request>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return this.method.send(UseTheRestApi.as(actor).send(this.request), this.config)
            .then(saveResponse(this.saveTo))
            .catch(catchAndSaveOnError(this.saveTo, this.catchError))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public andSaveResponse(saveTo: SaveToFn): SendHelper {
        this.saveTo = saveTo;
        return this;
    }

    public withConfig(config: RestClientConfig): SendHelper {
        this.config = config;
        return this;
    }

    public dontFailInCaseOfAnError(): SendHelper {
        this.catchError = true;
        return this;
    }

    public constructor(private request: SppRestRequest, private method: RequestMethod) {
    }
}

export class Send {
    public static the(request: SppRestRequest): Send {
        return new Send(request);
    }

    public as(method: RequestMethod): SendHelper {
        return new SendHelper(this.request, method);
    }

    private constructor(private request: SppRestRequest) {

    }
}

