import {RestClientConfig}  from "../../config/RestClientConfig";
import {RestRequest}       from "../interface/RestRequest";
import {RestRequestResult} from "../interface/RestRequestResult";
import * as rp             from "request-promise-native";
import merge               from "deepmerge";


export class RestRequestRqst implements RestRequest {

    public constructor(
        private resource: string,
        private clientConfig: RestClientConfig) {
    }

    public get(clientConfig: RestClientConfig = {}): Promise<RestRequestResult> {
        return this.send(rp.get, clientConfig);
    }

    public patch(clientConfig: RestClientConfig = {}): Promise<RestRequestResult> {
        return this.send(rp.patch, clientConfig);
    }

    public post(clientConfig: RestClientConfig = {}): Promise<RestRequestResult> {
        return this.send(rp.post, clientConfig);
    }

    public delete(clientConfig: RestClientConfig = {}): Promise<RestRequestResult> {
        return this.send(rp.delete, clientConfig);
    }

    /**
     * method was created to do a unit test on the merge
     * @param orig
     * @param merger
     */
    protected mergeClientConfig(orig: RestClientConfig, merger: RestClientConfig) {
        return merge(orig, merger);
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private send(fn: any, clientConfig: RestClientConfig = {}) {
        const conf: RestClientConfig = this.mergeClientConfig(this.clientConfig, clientConfig);
        return new Promise((fulfill, reject): void => {
            fn(this.resource, conf.requestOptions)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((response: any): void => {
                    fulfill(response);
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .catch((e: any): void => {
                    reject(e.response ? e.response : e);
                });
        });
    }

    public toString(): string {
        return `resource: ${this.resource} with configuration: ${JSON.stringify(this.clientConfig)}`
    }
}