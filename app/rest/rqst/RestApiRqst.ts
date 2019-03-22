import {RestAbilityOptions} from "../../screenplay/rest/abilities/UseTheRestApi";
import {RestApi}            from "../interface/RestAPI";
import {RestRequest}        from "../interface/RestRequest";
import {On}                 from "../lib/Ressource";
import {RestRequestRqst}    from "./RestRequestRqst";
import merge                from "deepmerge";


export class RestApiRqst implements RestApi {

    public static create(restAbilityOptions: RestAbilityOptions): RestApi {
        return new RestApiRqst(restAbilityOptions);
    }

    request(resource: On, restOptions: RestAbilityOptions = {}): RestRequest {
        const opts: RestAbilityOptions = merge(this.restAbilityOptions, restOptions);
        return new RestRequestRqst(resource.resource, opts)
    }

    constructor(private restAbilityOptions: RestAbilityOptions) {

    }
}