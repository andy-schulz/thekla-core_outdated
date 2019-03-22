import {RestApi}            from "../../rest/interface/RestApi";
import {RestRequest}        from "../../rest/interface/RestRequest";
import {On}                 from "../../rest/lib/Ressource";
import {RestAbilityOptions} from "./abilities/UseTheRestApi";



export interface RequestHelper extends Function {
    (restApi: RestApi, restOptions: RestAbilityOptions): RestRequest;
    description: string;
}

export class SppRestRequest{
    private restOptions: RestAbilityOptions = {};

    constructor(
        public resource: On,
        public sender: RequestHelper) {

    }

    using(restOptions: RestAbilityOptions) {
        this.restOptions = restOptions;

        this.sender.description = `${this.sender.description} using options: ${JSON.stringify(restOptions)}`;
        return this
    }

    send(restApi: RestApi): RestRequest {
        return this.sender(restApi, this.restOptions);
    }

    toString() {
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
    const send: RequestHelper = (restApi: RestApi, restOptions: RestAbilityOptions = {}) => {
        return restApi.request(resource, restOptions);
    };

    send.description = `resource: ${resource}`;
    return new SppRestRequest(resource, send);
}