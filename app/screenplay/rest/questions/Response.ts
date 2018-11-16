import {AxiosResponse} from "axios";
import {Question}      from "../../lib/matcher/Question";
import {UseTheRestApi} from "../abilities/UseTheRestApi";
import {UsesAbilities} from "../../Actor";
import {SppRequest}    from "../interfaces/requests";

export class Response implements Question<SppRequest> {

    static to(url: string): Response  {
        return new Response(url)
    }

    constructor(
        private url: string
    ) {}

    answeredBy(actor: UsesAbilities): Promise<SppRequest> {
        return UseTheRestApi.as(actor).get(this.url);
    }
}