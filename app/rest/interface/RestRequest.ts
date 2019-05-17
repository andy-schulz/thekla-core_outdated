import {RestClientConfig}  from "../../config/RestClientConfig";
import {RestRequestResult} from "./RestRequestResult";

export interface RestRequest {
    get(options?: RestClientConfig): Promise<RestRequestResult>;

    post(options?: RestClientConfig): Promise<RestRequestResult>;

    patch(options?: RestClientConfig): Promise<RestRequestResult>;

    delete(options?: RestClientConfig): Promise<RestRequestResult>;
}