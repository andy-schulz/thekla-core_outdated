import {RestApi}               from "../../../rest/interface/RestApi";
import {RestRequest}           from "../../../rest/interface/RestRequest";
import {Ability}               from "../../lib/abilities/Ability";
import {UsesAbilities}         from "../../Actor";
import {RequestPromiseOptions} from "request-promise-native";
import {SppRestRequest}        from "../SppRestRequests";

export interface RestAbilityOptions extends RequestPromiseOptions {
    [key:string]: any,
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

    static using(restApi: RestApi) {
        return new UseTheRestApi(restApi);
    }


    static as(actor: UsesAbilities): UseTheRestApi {
        return actor.withAbilityTo(UseTheRestApi) as UseTheRestApi;
    }

    send(spe: SppRestRequest): RestRequest {
        return spe.send(this.restApi)
    }

    constructor(private restApi: RestApi) {

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