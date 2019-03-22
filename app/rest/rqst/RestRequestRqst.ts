import {resource}           from "selenium-webdriver/http";
import {RestAbilityOptions} from "../../screenplay/rest/abilities/UseTheRestApi";
import {RestRequest}        from "../interface/RestRequest";
import {RestRequestResult}  from "../interface/RestRequestResult";
import * as rp              from "request-promise-native";

export class RestRequestRqst implements RestRequest {

    constructor(
        private resource: string,
        private options: RestAbilityOptions) {
    }

    // get(options: RestAbilityOptions = {}): Promise<RestRequestResult> {
    get(): Promise<RestRequestResult> {
        return this.send(rp.get);
    }

    patch(options: RestAbilityOptions = {}): Promise<RestRequestResult> {
        return this.send(rp.patch);
    }

    post(options: RestAbilityOptions = {}): Promise<RestRequestResult> {
        return this.send(rp.post);
    }

    delete(options: RestAbilityOptions = {}): Promise<RestRequestResult> {
        return this.send(rp.delete);
    }



    // private send(fn: any, options: RestAbilityOptions = {}) {
    private send(fn: any) {
        return new Promise((fulfill, reject) => {
            fn(this.resource, this.options)
                .then((response: any) => {
                    fulfill(response);
                })
                .catch((e: any) => {
                    reject(e.response);
                });
        });
    }

    toString() {
        return `resource: ${this.resource} with options: ${JSON.stringify(this.options)}`
    }
}