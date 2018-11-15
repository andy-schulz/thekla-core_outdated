import {Browser, Config} from "../..";
import {BrowserWdjs} from "../wdjs/BrowserWdjs";

export class BrowserFactory {

    public static create(config: Config, framework: string = "wdjs"): Browser {
        if(framework == "wdjs") {
            return BrowserWdjs.create(config);
        } else {
            throw Error(`Error: Framework '${framework}' not implemented`);
        }
    }

    public static cleanup(): Promise<any> {
        return Promise.all([BrowserWdjs.cleanup()])
    }
}