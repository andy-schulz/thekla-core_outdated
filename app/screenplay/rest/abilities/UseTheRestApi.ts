import {RestClientConfig} from "../../../config/RestClientConfig";
import {RestClient}       from "../../../rest/interface/RestClient";
import {RestRequest}      from "../../../rest/interface/RestRequest";
import {Ability}          from "../../lib/abilities/Ability";
import {UsesAbilities}    from "../../Actor";
import {SppRestRequest}   from "../SppRestRequests";


/**
 * Ability to use a REST Module
 *
 */
export class UseTheRestApi implements Ability {

    public static with(restApi: RestClient): UseTheRestApi {
        return new UseTheRestApi(restApi);
    }


    public static as(actor: UsesAbilities): UseTheRestApi {
        return actor.withAbilityTo(UseTheRestApi) as UseTheRestApi;
    }

    public send(spe: SppRestRequest): RestRequest {
        return spe.send(this.restApi)
    }

    public constructor(private restApi: RestClient) {

    }
}