import {RestAbilityOptions} from "../../screenplay/rest/abilities/UseTheRestApi";
import {On}                 from "../lib/Ressource";
import {RestRequest}        from "./RestRequest";

export interface RestApi {
    request(resource: On,  restOptions?: RestAbilityOptions): RestRequest;
}