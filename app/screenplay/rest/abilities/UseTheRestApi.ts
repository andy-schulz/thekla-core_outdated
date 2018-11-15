import {Ability}       from "../../lib/abilities/Ability";
import {UsesAbilities} from "../../Actor";
import axios, {AxiosInstance, AxiosResponse} from "axios";


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