import {RestAbilityOptions} from "../../screenplay/rest/abilities/UseTheRestApi";
import {RestApiRqst}        from "../rqst/RestApiRqst";

export class RestApiFactory {
    public static create(conf: RestAbilityOptions) {
        return RestApiRqst.create(conf)
    }
}