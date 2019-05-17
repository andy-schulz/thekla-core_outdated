import {RestClientConfig}  from "../../config/RestClientConfig";
import {RestRequest}       from "../interface/RestRequest";
import {RestRequestResult} from "../interface/RestRequestResult";

export interface RequestMethod {
    send(request: RestRequest, options?: RestClientConfig): Promise<RestRequestResult>;
}

export class MethodGet implements RequestMethod{
    public send(request: RestRequest, options?: RestClientConfig) {
        return request.get(options)
    }
}

export class MethodPost implements RequestMethod{
    public send(request: RestRequest, options?: RestClientConfig) {
        return request.post(options)
    }
}

export class MethodDelete implements RequestMethod{
    public send(request: RestRequest, options?: RestClientConfig) {
        return request.delete(options)
    }
}

export class MethodPatch implements RequestMethod{
    public send(request: RestRequest, options?: RestClientConfig) {
        return request.patch(options)
    }
}

export class Method {

    public static get(): RequestMethod {
        return new MethodGet()
    }

    public static post(): RequestMethod {
        return new MethodPost()
    }

    public static delete(): RequestMethod {
        return new MethodDelete()
    }

    public static patch(): RequestMethod {
        return new MethodPatch()
    }
}