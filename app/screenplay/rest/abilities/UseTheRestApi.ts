import {RestApi}               from "../../../rest/interface/RestApi";
import {RestRequest}           from "../../../rest/interface/RestRequest";
import {Ability}               from "../../lib/abilities/Ability";
import {UsesAbilities}         from "../../Actor";
import {RequestPromiseOptions} from "request-promise-native";
import {SppRestRequest}        from "../SppRestRequests";

export interface RestAbilityOptions extends RequestPromiseOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    // eslint-disable-next-line quotes
    restClient?: "request";
    baseUrl?: string;
}

/**
 * Ability to use a REST Module
 *
 */
export class UseTheRestApi implements Ability {

    // static using(standardOptions: RestAbilityOptions = {restClient: "request"}) {
    //     return new UseTheRestApi(standardOptions);
    // }

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




    // send(request: SppRequest): RestRequest {
    //     return request.send(merge(request.options, this.restAbilityOptions));
    // }



    // post(url: string, options: RestAbilityOptions = {}): Promise<SppRequestResult> {
    //     return new Promise((fulfill, reject) => {
    //         rp.post(url, merge(this.restAbilityOptions, options)).then((response: SppRequestResult) => {
    //             fulfill(response);
    //         }).catch((e: any) => {
    //             reject(e);
    //         });
    //     });
    // }
    //
    // delete(url: string, options: RestAbilityOptions = {}): Promise<SppRequestResult> {
    //     return new Promise((fulfill, reject) => {
    //         rp.delete(url, merge(this.restAbilityOptions, options)).then((response: SppRequestResult) => {
    //             fulfill(response);
    //         }).catch((e: any) => {
    //             reject(e);
    //         });
    //     });
    // }
}