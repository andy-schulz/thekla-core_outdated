import {RestClientConfig}  from "../../config/RestClientConfig";
import {RestRequest}       from "../interface/RestRequest";
import {RestRequestResult} from "../interface/RestRequestResult";
import * as rp             from "request-promise-native";
import merge               from "deepmerge";


export class RestRequestRqst implements RestRequest {

    public constructor(
        private resource: string,
        private options: RestClientConfig) {
    }

    public get(options: RestClientConfig = {}): Promise<RestRequestResult> {
        return this.send(rp.get, options);
    }

    public patch(options: RestClientConfig = {}): Promise<RestRequestResult> {
        return this.send(rp.patch, options);
    }

    public post(options: RestClientConfig = {}): Promise<RestRequestResult> {
        return this.send(rp.post, options);
    }

    public delete(options: RestClientConfig = {}): Promise<RestRequestResult> {
        return this.send(rp.delete, options);
    }

    /**
     * method was created to do a unit test on the merge
     * @param orig
     * @param merger
     */
    protected mergeOpts(orig: RestClientConfig, merger: RestClientConfig) {
        return merge(orig, merger);
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private send(fn: any, options: RestClientConfig = {}) {
        const opts: RestClientConfig = this.mergeOpts(this.options, options);
        return new Promise((fulfill, reject): void => {
            fn(this.resource, opts.restClientOptions)
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
        return `resource: ${this.resource} with options: ${JSON.stringify(this.options)}`
    }
}