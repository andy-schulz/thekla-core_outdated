import {RestApiConfig} from "../../config/RestApiConfig";
import {RestApi}       from "../interface/RestApi";
import {RestApiRqst}   from "../rqst/RestApiRqst";

export class RestApiFactory {
    public static create(conf: RestApiConfig): RestApi {
        return RestApiRqst.create(conf)
    }
}