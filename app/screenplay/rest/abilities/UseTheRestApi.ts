import {RestApiConfig}  from "../../../config/RestApiConfig";
import {RestApi}        from "../../../rest/interface/RestApi";
import {RestRequest}    from "../../../rest/interface/RestRequest";
import {Ability}        from "../../lib/abilities/Ability";
import {UsesAbilities}  from "../../Actor";
import {SppRestRequest} from "../SppRestRequests";


/**
 * Ability to use a REST Module
 *
 */
export class UseTheRestApi implements Ability {

    public static using(restApi: RestApi): UseTheRestApi {
        return new UseTheRestApi(restApi);
    }


    public static as(actor: UsesAbilities): UseTheRestApi {
        return actor.withAbilityTo(UseTheRestApi) as UseTheRestApi;
    }

    public send(spe: SppRestRequest): RestRequest {
        return spe.send(this.restApi)
    }

    public constructor(private restApi: RestApi) {

    }
}