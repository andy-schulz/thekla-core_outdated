import {RestApiConfig} from "../../config/RestApiConfig";
import {RestApi}       from "../../rest/interface/RestApi";
import {RestRequest}   from "../../rest/interface/RestRequest";
import {On}            from "../../rest/lib/Ressource";



export interface RequestHelper extends Function {
    (restApi: RestApi, restOptions: RestApiConfig): RestRequest;
    description: string;
}

export class SppRestRequest{
    private restOptions: RestApiConfig = {};

    public constructor(
        public resource: On,
        public sender: RequestHelper) {

    }

    public using(restOptions: RestApiConfig): SppRestRequest {
        this.restOptions = restOptions;

        this.sender.description = `${this.sender.description} using options: ${JSON.stringify(restOptions)}`;
        return this
    }

    public send(restApi: RestApi): RestRequest {
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
    const send: RequestHelper = (restApi: RestApi, restOptions: RestApiConfig = {}): RestRequest => {
        return restApi.request(resource, restOptions);
    };

    send.description = `resource: ${resource}`;
    return new SppRestRequest(resource, send);
}