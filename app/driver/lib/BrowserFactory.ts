import {Browser, SeleniumConfig} from "../..";
import {BrowserScreenshotData}   from "../interface/Browser";
import {BrowserWdjs}             from "../wdjs/BrowserWdjs";

export class BrowserFactory {

    public static create(config: SeleniumConfig, framework: string = "wdjs"): Promise<Browser> {
        if(framework == "wdjs") {
            return BrowserWdjs.create(<SeleniumConfig>config);
        } else {
            throw Error(`Error: Framework '${framework}' not implemented`);
        }
    }

    public static cleanup(): Promise<any> {
        return Promise.all([BrowserWdjs.cleanup()])
    }

    public static takeScreenshots(): Promise<BrowserScreenshotData[]> {
        return BrowserWdjs.takeScreenshots()
    }

    public static saveScreenshots(filePath: string, baseFileName: string): Promise<string[]> {
        return BrowserWdjs.saveScreenshots(filePath, baseFileName);
    }
}