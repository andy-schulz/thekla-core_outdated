import {RestClient}       from "../interface/RestClient";
import {RestRequest}      from "../interface/RestRequest";
import {On}               from "../lib/Ressource";
import {RestRequestRqst}  from "./RestRequestRqst";
import merge              from "deepmerge";
import {RestClientConfig} from "../../config/RestClientConfig";


export class RestClientRqst implements RestClient {

    public static from(clientConfig: RestClientConfig): RestClient {
        return new RestClientRqst(clientConfig);
    }

    public request(resource: On, clientConfig: RestClientConfig = {}): RestRequest {
        const conf: RestClientConfig = merge(this.clientConfig, clientConfig);
        return new RestRequestRqst(resource.resource, conf)
    }

    private constructor(private clientConfig: RestClientConfig) {

    }
}