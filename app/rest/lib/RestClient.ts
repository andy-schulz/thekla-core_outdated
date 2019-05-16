import {RestApiConfig} from "../../config/RestApiConfig";
import {RestApi}       from "../interface/RestApi";
import {RestApiRqst}   from "../rqst/RestApiRqst";

export class RestClient {
    public static from(conf: RestApiConfig): RestApi {
        return RestApiRqst.create(conf)
    }
}