import {Browser, Capabilities, CapabilitiesWdjs} from "../..";
import {BrowserWdjs}                             from "../wdjs/BrowserWdjs";

export class BrowserFactory {

    public static create(config: Capabilities, framework: string = "wdjs"): Browser {
        if(framework == "wdjs") {
            return BrowserWdjs.create(<CapabilitiesWdjs>config);
        } else {
            throw Error(`Error: Framework '${framework}' not implemented`);
        }
    }

    public static cleanup(): Promise<any> {
        return Promise.all([BrowserWdjs.cleanup()])
    }
}