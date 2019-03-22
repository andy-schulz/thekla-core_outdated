import {RequestMethod}                        from "../../../rest/lib/Method";
import {Question}                             from "../../lib/matcher/Question";
import {UseTheRestApi}                        from "../abilities/UseTheRestApi";
import {UsesAbilities}                        from "../../Actor";
import {SppRestRequest, SppRestRequestResult} from "../SppRestRequests";

export class Response implements Question<SppRestRequestResult> {
    private method: RequestMethod;
    public static of(request: SppRestRequest): Response  {
        return new Response(request)
    }

    public as(method: RequestMethod) {
        this.method = method;
        return this;
    }

    constructor(
        private request: SppRestRequest
    ) {}

    answeredBy(actor: UsesAbilities): Promise<SppRestRequestResult> {
        return this.method.send(UseTheRestApi.as(actor).send(this.request));
    }
}