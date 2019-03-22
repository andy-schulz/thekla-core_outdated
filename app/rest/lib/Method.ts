import {RestRequest}       from "../interface/RestRequest";
import {RestRequestResult} from "../interface/RestRequestResult";

export interface RequestMethod {
    send(request: RestRequest): Promise<RestRequestResult>
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

export class MethodGet implements RequestMethod{
    send(request: RestRequest) {
        return request.get()
    }
}

export class MethodPost implements RequestMethod{
    send(request: RestRequest) {
        return request.post()
    }
}

export class MethodDelete implements RequestMethod{
    send(request: RestRequest) {
        return request.delete()
    }
}

export class MethodPatch implements RequestMethod{
    send(request: RestRequest) {
        return request.patch()
    }
}