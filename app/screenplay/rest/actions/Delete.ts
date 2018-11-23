import merge                          from "deepmerge";
import * as rp                        from "request-promise-native";
import {RestAbilityOptions}           from "../abilities/UseTheRestApi";
import {SppRequest, SppRequestResult} from "../interfaces/requests";

export class Delete implements SppRequest {
    private restAbilityOptions: RestAbilityOptions;
    public static from(ressource: string): Delete {
        return new Delete(ressource);
    }

    constructor(private ressource: string) {
        this.restAbilityOptions = {};
    }

    public using(options: RestAbilityOptions): Delete {
        this.restAbilityOptions = options;
        return this;
    }


    send(options: RestAbilityOptions): Promise<SppRequestResult> {
        return new Promise((fulfill, reject) => {
            rp.delete(this.ressource, merge(options, this.restAbilityOptions)).then((response: SppRequestResult) => {
                fulfill(response);
            }).catch((e: any) => {
                reject(e);
            });
        });
    }

    get options(): RestAbilityOptions {
        return this.restAbilityOptions;
    }
}