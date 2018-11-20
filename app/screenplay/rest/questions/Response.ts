import {AxiosResponse}                from "axios";
import {Question}                     from "../../lib/matcher/Question";
import {UseTheRestApi}                from "../abilities/UseTheRestApi";
import {UsesAbilities}                from "../../Actor";
import {SppRequest, SppRequestResult} from "../interfaces/requests";

export class Response implements Question<SppRequestResult> {

    static of(request: SppRequest): Response  {
        return new Response(request)
    }

    constructor(
        private request: SppRequest
    ) {}

    answeredBy(actor: UsesAbilities): Promise<SppRequestResult> {
        return UseTheRestApi.as(actor).send(this.request);
    }
}