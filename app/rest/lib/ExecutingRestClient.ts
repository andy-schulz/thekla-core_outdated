import {RestClientConfig} from "../../config/RestClientConfig";
import {RestClient}       from "../interface/RestClient";
import {RestClientRqst}   from "../rqst/RestClientRqst";

export class ExecutingRestClient {
    public static from(conf: RestClientConfig): RestClient {
        return RestClientRqst.from(conf)
    }
}