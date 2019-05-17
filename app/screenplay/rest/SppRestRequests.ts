import {RestClientConfig} from "../../config/RestClientConfig";
import {RestClient}       from "../../rest/interface/RestClient";
import {RestRequest}      from "../../rest/interface/RestRequest";
import {On}               from "../../rest/lib/Ressource";



export interface RequestHelper extends Function {
    (restApi: RestClient, restOptions: RestClientConfig): RestRequest;
    description: string;
}

export class SppRestRequest{
    private restOptions: RestClientConfig = {};

    public constructor(
        public resource: On,
        public sender: RequestHelper) {

    }

    public using(restOptions: RestClientConfig): SppRestRequest {
        this.restOptions = restOptions;

        this.sender.description = `${this.sender.description} using options: ${JSON.stringify(restOptions)}`;
        return this
    }

    public send(restApi: RestClient): RestRequest {
        return this.sender(restApi, this.restOptions);
    }

    public toString(): string {
        return this.sender.description;
    }
}

export class SppRestRequestResult {

}

/**
 * creating an SppRestRequest
 * @param resource - resource the request is going to
 */
export function request(resource: On): SppRestRequest {
    const send: RequestHelper = (restApi: RestClient, restOptions: RestClientConfig = {}): RestRequest => {
        return restApi.request(resource, restOptions);
    };

    send.description = `resource: ${resource}`;
    return new SppRestRequest(resource, send);
}