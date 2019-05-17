import {RestClientConfig} from "../../config/RestClientConfig";
import {RestClient}       from "../../rest/interface/RestClient";
import {RestRequest}      from "../../rest/interface/RestRequest";
import {On}               from "../../rest/lib/Ressource";



export interface RequestHelper extends Function {
    (restClient: RestClient, clientConfig: RestClientConfig): RestRequest;
    description: string;
}

export class SppRestRequest{
    private clientConfig: RestClientConfig = {};

    public constructor(
        public resource: On,
        public sender: RequestHelper) {

    }

    public using(clientConfig: RestClientConfig): SppRestRequest {
        this.clientConfig = clientConfig;

        this.sender.description = `${this.sender.description} using client config: ${JSON.stringify(clientConfig)}`;
        return this
    }

    public send(restClient: RestClient): RestRequest {
        return this.sender(restClient, this.clientConfig);
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
    const send: RequestHelper = (restClient: RestClient, clientConfig: RestClientConfig = {}): RestRequest => {
        return restClient.request(resource, clientConfig);
    };

    send.description = `resource: ${resource}`;
    return new SppRestRequest(resource, send);
}