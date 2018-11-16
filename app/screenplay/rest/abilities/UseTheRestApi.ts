import * as yargs                     from "yargs";
import {Ability}                      from "../../lib/abilities/Ability";
import {UsesAbilities}                from "../../Actor";
import {AxiosInstance, AxiosResponse} from "axios";
import * as rp                        from "request-promise-native"
import request, {Request}             from "request"
import {SppRequest}                   from "../interfaces/requests";
/**
 * Ability to use the Axios Rest Module
 *
 */
export class UseTheRestApi implements Ability {

    static using(restClient: string) {
        return new UseTheRestApi(restClient);
    }

    static as(actor: UsesAbilities): UseTheRestApi {
        return <UseTheRestApi>actor.withAbilityTo(UseTheRestApi);
    }

    constructor(private restClient: string) {}

    get(url: string): Promise<SppRequest> {
        let config:{ [index:string] : {message: string} | object } = {};
        const args = yargs.argv;
        if (args.proxy) {
            config.proxy = args.proxy
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