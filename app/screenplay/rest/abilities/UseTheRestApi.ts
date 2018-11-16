import {Ability}                      from "../../lib/abilities/Ability";
import {UsesAbilities}                from "../../Actor";
import * as rp                        from "request-promise-native"
import {SppRequest}                   from "../interfaces/requests";

export interface RestAbilityOptions {
    restClient: "request"
    proxy?: string;
}

/**
 * Ability to use a REST Module
 *
 */
export class UseTheRestApi implements Ability {

    static using(restClient: RestAbilityOptions) {
        return new UseTheRestApi(restClient);
    }

    static as(actor: UsesAbilities): UseTheRestApi {
        return <UseTheRestApi>actor.withAbilityTo(UseTheRestApi);
    }

    constructor(private restAbilityOptions: RestAbilityOptions) {}

    get(url: string): Promise<SppRequest> {
        let config:{ [index:string] : string | object } = {};
        if (this.restAbilityOptions.proxy) {
            config.proxy = this.restAbilityOptions.proxy
        }

        return new Promise((fulfill, reject) => {
            rp.get(url, config).then((response: SppRequest) => {
                fulfill(response);
            }).catch((e: any) => {
                reject(e);
            });
        });




    }
}