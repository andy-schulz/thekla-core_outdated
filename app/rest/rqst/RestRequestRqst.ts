import {RestAbilityOptions} from "../../screenplay/rest/abilities/UseTheRestApi";
import {RestRequest}        from "../interface/RestRequest";
import {RestRequestResult}  from "../interface/RestRequestResult";
import * as rp              from "request-promise-native";

export class RestRequestRqst implements RestRequest {

    public constructor(
        private resource: string,
        private options: RestAbilityOptions) {
    }

    public get(options: RestAbilityOptions = {}): Promise<RestRequestResult> {
        return this.send(rp.get, options);
    }

    public patch(options: RestAbilityOptions = {}): Promise<RestRequestResult> {
        return this.send(rp.patch, options);
    }

    public post(options: RestAbilityOptions = {}): Promise<RestRequestResult> {
        return this.send(rp.post, options);
    }

    public delete(options: RestAbilityOptions = {}): Promise<RestRequestResult> {
        return this.send(rp.delete, options);
    }


    //TODO: implement Rest Options with merge objects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private send(fn: any, options: RestAbilityOptions = {}) {
        return new Promise((fulfill, reject): void => {
            fn(this.resource, this.options)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((response: any): void => {
                    fulfill(response);
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .catch((e: any): void => {
                    reject(e.response);
                });
        });
    }

    public toString(): string {
        return `resource: ${this.resource} with options: ${JSON.stringify(this.options)}`
    }
}