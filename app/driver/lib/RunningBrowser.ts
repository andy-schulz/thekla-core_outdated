import {BrowserHelper, SeleniumConfig, BrowserScreenshotData} from "../..";
import {BrowserWdjs}             from "../wdjs/BrowserWdjs";

export class RunningBrowser {

    public static startedOn(config: SeleniumConfig, framework: string = `wdjs`): BrowserHelper {
        return new BrowserHelper(config as SeleniumConfig);
    }

    // function returns an array of Browser implementations
    // right now there is only the BrowserWdjs implementation
    // other implementations can be added here
    public static cleanup(): Promise<void[][]> {
        return Promise.all([BrowserWdjs.cleanup()])
    }

    public static takeScreenshots(): Promise<BrowserScreenshotData[]> {
        return BrowserWdjs.takeScreenshots()
    }

    public static saveScreenshots(filePath: string, baseFileName: string): Promise<string[]> {
        return BrowserWdjs.saveScreenshots(filePath, baseFileName);
    }
}