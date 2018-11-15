import {AxiosResponse} from "axios";
import {Question}      from "../../lib/matcher/Question";
import {UseTheRestApi} from "../abilities/UseTheRestApi";
import {UsesAbilities} from "../../Actor";

export class Response implements Question<AxiosResponse> {

    static to(url: string): Response  {
        return new Response(url)
    }

    constructor(
        private url: string
    ) {}

    answeredBy(actor: UsesAbilities): Promise<AxiosResponse> {
        return UseTheRestApi.as(actor).get(this.url);
    }
}