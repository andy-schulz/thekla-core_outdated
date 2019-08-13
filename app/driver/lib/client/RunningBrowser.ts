import {ClientHelper, ServerConfig, BrowserScreenshotData} from "../../../index";
import {ClientWdio}                                        from "../../wdio/ClientWdio";
import {BrowserWdjs}                                       from "../../wdjs/BrowserWdjs";
import _                                                   from "lodash"

export class RunningBrowser {

    public static startedOn(config: ServerConfig): ClientHelper {
        return new ClientHelper(config as ServerConfig);
    }

    // function returns an array of Browser implementations
    // right now there is only the BrowserWdjs implementation
    // other implementations can be added here
    public static cleanup(): Promise<void[][]> {
        return Promise.all([
            BrowserWdjs.cleanup(),
            ClientWdio.cleanup()
        ])
    }

    public static takeScreenshots(): Promise<BrowserScreenshotData[]> {
        return Promise.all([BrowserWdjs.takeScreenshots(), ClientWdio.takeScreenshots()])
            .then((screenshots: BrowserScreenshotData[][]): BrowserScreenshotData[] => {
                return _.flatten(screenshots);
            })
        return BrowserWdjs.takeScreenshots()
    }

    public static saveScreenshots(filePath: string, baseFileName: string): Promise<string[]> {
        return Promise.all([
            BrowserWdjs.saveScreenshots(filePath, baseFileName),
            ClientWdio.saveScreenshots(filePath, baseFileName)])
            .then((screenshots: string[][]): string[] => {
                return _.flatten(screenshots)
            });
        return BrowserWdjs.saveScreenshots(filePath, baseFileName);
    }
}