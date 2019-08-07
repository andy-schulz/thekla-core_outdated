import {BrowserHelper, ServerConfig, BrowserScreenshotData} from "../..";
import {ClientWdio}                                         from "../wdio/ClientWdio";
import {BrowserWdjs}                                        from "../wdjs/BrowserWdjs";

export class RunningBrowser {

    public static startedOn(config: ServerConfig): BrowserHelper {
        return new BrowserHelper(config as ServerConfig);
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
        return BrowserWdjs.takeScreenshots()
    }

    public static saveScreenshots(filePath: string, baseFileName: string): Promise<string[]> {
        return BrowserWdjs.saveScreenshots(filePath, baseFileName);
    }
}