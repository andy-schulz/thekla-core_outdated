import {RestApiConfig} from "../../config/RestApiConfig";
import {On}            from "../lib/Ressource";
import {RestRequest}   from "./RestRequest";

export interface RestApi {
    request(resource: On,  restOptions?: RestApiConfig): RestRequest;
}