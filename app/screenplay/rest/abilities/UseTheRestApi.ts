import {CoreOptions}                  from "request";
import {Ability}                      from "../../lib/abilities/Ability";
import {UsesAbilities}                from "../../Actor";
import {SppRequest, SppRequestResult} from "../interfaces/requests";
import merge                          from "deepmerge";
import {RequestPromiseOptions}        from "request-promise-native";

export interface RestAbilityOptions extends RequestPromiseOptions{
    restClient?: "request"
}

/**
 * Ability to use a REST Module
 *
 */
export class UseTheRestApi implements Ability {

    static using(standardOptions: RestAbilityOptions = {restClient: "request"}) {
        return new UseTheRestApi(standardOptions);
    }

    static as(actor: UsesAbilities): UseTheRestApi {
        return <UseTheRestApi>actor.withAbilityTo(UseTheRestApi);
    }

    constructor(private restAbilityOptions: RestAbilityOptions) {}


    send(request: SppRequest): Promise<SppRequestResult> {
        return request.send(merge(request.options, this.restAbilityOptions));
    }



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