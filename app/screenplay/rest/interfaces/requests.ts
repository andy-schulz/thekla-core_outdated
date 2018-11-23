import request              from "request"
import {RestAbilityOptions} from "../abilities/UseTheRestApi";
export interface SppRequestResult extends request.Request {

}

export interface SppRequest {
    options: RestAbilityOptions;
    send(options: RestAbilityOptions): Promise<SppRequestResult>;
}