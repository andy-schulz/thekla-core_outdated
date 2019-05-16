import {RestApi}         from "../interface/RestAPI";
import {RestRequest}     from "../interface/RestRequest";
import {On}              from "../lib/Ressource";
import {RestRequestRqst} from "./RestRequestRqst";
import merge             from "deepmerge";
import {RestApiConfig}   from "../../config/RestApiConfig";


export class RestApiRqst implements RestApi {

    public static create(restApiConfig: RestApiConfig): RestApi {
        return new RestApiRqst(restApiConfig);
    }

    public request(resource: On, restOptions: RestApiConfig = {}): RestRequest {
        const opts: RestApiConfig = merge(this.restApiConfig, restOptions);
        return new RestRequestRqst(resource.resource, opts)
    }

    private constructor(private restApiConfig: RestApiConfig) {

    }
}