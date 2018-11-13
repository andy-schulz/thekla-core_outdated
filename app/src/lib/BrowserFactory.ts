import {Browser, Config} from "../..";
import {BrowserWdjs} from "../wdjs/BrowserWdjs";

export class BrowserFactory {

    public static create(config: Config, framework: string = "wdjs"): Promise<Browser> {
        if(framework == "wdjs") {
            return BrowserWdjs.create(config);
        } else {
            throw Promise.reject(`Error: Framework '${framework}' not implemented`);
        }
    }

    public static cleanup(): Promise<any> {
        return Promise.all([BrowserWdjs.cleanup()])
    }
}