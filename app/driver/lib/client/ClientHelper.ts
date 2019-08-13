import {DesiredCapabilities}            from "../../../config/DesiredCapabilities";
import {ServerConfig}                   from "../../../config/ServerConfig";
import {Browser, BrowserScreenshotData} from "../../interface/Browser";
import {ClientWdio}                     from "../../wdio/ClientWdio";
import {BrowserWdjs}                    from "../../wdjs/BrowserWdjs";
import _                                from "lodash";

export class ClientHelper {

    public withCapabilities(capabilities: DesiredCapabilities): Browser {
        if (!this.config.automationFramework || !this.config.automationFramework.type || this.config.automationFramework.type === `wdjs`)
            return BrowserWdjs.create(this.config, capabilities);

        if (this.config.automationFramework.type == `wdio`)
            return ClientWdio.create(this.config, capabilities);

        throw new Error(`the client library called ${this.config.automationFramework} is not implemented yet`)
    }

    public constructor(private config: ServerConfig) {
    }

    public static create(conf: ServerConfig, capabilities: DesiredCapabilities, clientName?: string) {
        if (!conf.automationFramework || !conf.automationFramework.type || conf.automationFramework.type === `wdjs`)
            return BrowserWdjs.create(conf, capabilities, clientName);

        if (conf.automationFramework.type == `wdio`)
            return ClientWdio.create(conf, capabilities, clientName);

        throw new Error(`the client library called ${conf.automationFramework} is not implemented yet`)
    }

    public static cleanup(browserToClean?: Browser[]): Promise<void[][]> {
        return Promise.all([BrowserWdjs.cleanup(browserToClean), ClientWdio.cleanup(browserToClean)]);
    }

    public static get availableBrowser(): string[] {
        return [...BrowserWdjs.availableBrowser, ...ClientWdio.availableClients]
    }

    public static getClient(clientName: string): Browser | undefined {

        try {
            return BrowserWdjs.getBrowser(clientName)
        } catch (e) {
            return ClientWdio.getClient(clientName)
        }
    }

    public static takeScreenshots(): Promise<BrowserScreenshotData[]> {
        return Promise.all([BrowserWdjs.takeScreenshots(), ClientWdio.takeScreenshots()])
            .then((screenshots: BrowserScreenshotData[][]) => {
                return _.flatten(screenshots)
            });
    }

    public static saveScreenshots(filepath: string, baseFileName: string): Promise<string[]> {
        return Promise.all([
            BrowserWdjs.saveScreenshots(filepath, baseFileName),
            ClientWdio.saveScreenshots(filepath, baseFileName)])
            .then((screenshots: string[][]) => {
                return _.flatten(screenshots)
            });
    }
}

export function cleanupClients(browserMap: Map<string, Browser>, browserToClean?: Browser[]): Promise<void[]> {

    if (browserToClean) {
        let browserCleanupPromises: Promise<void>[] = [];

        const entries = [...browserMap.entries()];
        browserToClean.map((browser: Browser): void => {
            entries.map((browserEntry: [string, Browser]): void => {
                if (browser === browserEntry[1]) {
                    browserCleanupPromises.push(browser.quit());
                    browserMap.delete(browserEntry[0]);
                }
            });
        });

        return Promise.all(browserCleanupPromises);
    }

    return Promise.all(
        [...browserMap.values()]
            .map((browser): Promise<void> => {
                return browser.quit();
            })
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((result: any[]): any[] => {
            browserMap.clear();
            return result;
        })
}

export function executeFnOnClient<T>(getClient: Function, func: string, params: any[] = []): Promise<T> {
    return new Promise((resolve, reject): void => {
        getClient()
            .then((driver: any): void => {
                driver[func](...params)
                    .then((param: any) => {
                        resolve(param)
                    }, (e: any) => {
                        reject(e)
                    })
                // .then(fulfill, reject)
            })
            .catch(reject)
    })
}