import {Ability}       from "../../lib/abilities/Ability";
import {UsesAbilities} from "../../Actor";
import {AxiosInstance, AxiosResponse} from "axios";

/**
 * Ability to use the Axios Rest Module
 *
 */
export class UseTheRestApi implements Ability {

    static using(restClient: AxiosInstance) {
        return new UseTheRestApi(restClient);
    }

    static as(actor: UsesAbilities): UseTheRestApi {
        return <UseTheRestApi>actor.withAbilityTo(UseTheRestApi);
    }

    constructor(private restClient: AxiosInstance) {}

    get(url: string): Promise<AxiosResponse> {
        return this.restClient.get(url);
    }
}