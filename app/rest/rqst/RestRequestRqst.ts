import {RestApiConfig}     from "../../config/RestApiConfig";
import {RestRequest}       from "../interface/RestRequest";
import {RestRequestResult} from "../interface/RestRequestResult";
import * as rp             from "request-promise-native";
import merge               from "deepmerge";


export class RestRequestRqst implements RestRequest {

    public constructor(
        private resource: string,
        private options: RestApiConfig) {
    }

    public get(options: RestApiConfig = {}): Promise<RestRequestResult> {
        return this.send(rp.get, options);
    }

    public patch(options: RestApiConfig = {}): Promise<RestRequestResult> {
        return this.send(rp.patch, options);
    }

    public post(options: RestApiConfig = {}): Promise<RestRequestResult> {
        return this.send(rp.post, options);
    }

    public delete(options: RestApiConfig = {}): Promise<RestRequestResult> {
        return this.send(rp.delete, options);
    }

    /**
     * method was created to do a unit test on the merge
     * @param orig
     * @param merger
     */
    protected mergeOpts(orig: RestApiConfig, merger: RestApiConfig) {
        return merge(orig, merger);
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private send(fn: any, options: RestApiConfig = {}) {
        const opts: RestApiConfig = this.mergeOpts(this.options, options);
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