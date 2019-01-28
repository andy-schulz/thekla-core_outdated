import {Browser, SeleniumConfig} from "../..";
import {BrowserWdjs}                                                    from "../wdjs/BrowserWdjs";

export class BrowserFactory {

    public static create(config: SeleniumConfig, framework: string = "wdjs"): Browser {
        if(framework == "wdjs") {
            return BrowserWdjs.create(<SeleniumConfig>config);
        } else {
            throw Error(`Error: Framework '${framework}' not implemented`);
        }
    }

    public static cleanup(): Promise<any> {
        return Promise.all([BrowserWdjs.cleanup()])
    }

    // public static takeScreenshots(): Promise<string[]> {
        // return BrowserWdjs.takeScreenshots()
    // }
}