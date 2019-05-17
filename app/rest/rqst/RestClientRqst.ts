import {RestClient}       from "../interface/RestClient";
import {RestRequest}      from "../interface/RestRequest";
import {On}               from "../lib/Ressource";
import {RestRequestRqst}  from "./RestRequestRqst";
import merge              from "deepmerge";
import {RestClientConfig} from "../../config/RestClientConfig";


export class RestClientRqst implements RestClient {

    public static from(restApiConfig: RestClientConfig): RestClient {
        return new RestClientRqst(restApiConfig);
    }

    public request(resource: On, restOptions: RestClientConfig = {}): RestRequest {
        const opts: RestClientConfig = merge(this.restApiConfig, restOptions);
        return new RestRequestRqst(resource.resource, opts)
    }

    private constructor(private restApiConfig: RestClientConfig) {

    }
}