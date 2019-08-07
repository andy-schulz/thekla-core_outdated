import {DesiredCapabilities} from "../../config/DesiredCapabilities";
import {ServerConfig}        from "../../config/ServerConfig";
import {Browser}             from "../interface/Browser";
import {BrowserWdjs}         from "../wdjs/BrowserWdjs";

export class BrowserHelper {

    public withCapabilities(capabilities: DesiredCapabilities): Browser {
        if (this.config.automationFramework == `wdio`)
            throw new Error(`Automation Framework webdriver.io not implemented yet`);

        return BrowserWdjs.create(this.config, capabilities);
    }

    public constructor(private config: ServerConfig) {
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

export function executeFnOnClient<T>(getClient: Function, func: string, params: any[]): Promise<T> {
    return new Promise((fulfill, reject): void => {
        getClient()
            .then((driver: any): void => {
                driver[func](...params)
                    .then(fulfill, reject)
            })
            .catch(reject)
    })
}