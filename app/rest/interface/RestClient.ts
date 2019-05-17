import {RestClientConfig} from "../../config/RestClientConfig";
import {On}               from "../lib/Ressource";
import {RestRequest}      from "./RestRequest";

export interface RestClient {
    request(resource: On,  restOptions?: RestClientConfig): RestRequest;
}