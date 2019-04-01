import {BrowserHelper, SeleniumConfig, BrowserScreenshotData} from "../..";
import {BrowserWdjs}             from "../wdjs/BrowserWdjs";

export class RunningBrowser {

    public static startedOn(config: SeleniumConfig, framework: string = "wdjs"): BrowserHelper {
        return new BrowserHelper(<SeleniumConfig>config);
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