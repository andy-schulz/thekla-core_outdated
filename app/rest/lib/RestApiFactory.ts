import {RestAbilityOptions} from "../../screenplay/rest/abilities/UseTheRestApi";
import {RestApi}            from "../interface/RestApi";
import {RestApiRqst}        from "../rqst/RestApiRqst";

export class RestApiFactory {
    public static create(conf: RestAbilityOptions): RestApi {
        return RestApiRqst.create(conf)
    }
}