import {RestApiConfig}     from "../../config/RestApiConfig";
import {RestRequestResult} from "./RestRequestResult";

export interface RestRequest {
    get(options?: RestApiConfig): Promise<RestRequestResult>;

    post(options?: RestApiConfig): Promise<RestRequestResult>;

    patch(options?: RestApiConfig): Promise<RestRequestResult>;

    delete(options?: RestApiConfig): Promise<RestRequestResult>;
}