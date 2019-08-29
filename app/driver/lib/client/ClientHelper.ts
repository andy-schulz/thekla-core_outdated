import {getLogger}                      from "@log4js-node/log4js-api";
import {Client}                         from "webdriver";
import {DesiredCapabilities}            from "../../../config/DesiredCapabilities";
import {ServerConfig}                   from "../../../config/ServerConfig";
import {Browser, BrowserScreenshotData} from "../../interface/Browser";
import {ClientWdio}                     from "../../wdio/ClientWdio";
import _                                from "lodash";



export class ClientHelper {

    public withCapabilities(capabilities: DesiredCapabilities): Browser {
        if (!this.config.automationFramework || !this.config.automationFramework.type || this.config.automationFramework.type === `wdio`)
            return ClientWdio.create({serverConfig: this.config, capabilities: capabilities});

        throw new Error(`the client library called ${this.config.automationFramework} is not implemented yet`)
    }

    public constructor(private config: ServerConfig) {
    }

    public static create(conf: ServerConfig, capabilities: DesiredCapabilities, clientName?: string): Browser {
        if (!conf.automationFramework || !conf.automationFramework.type || conf.automationFramework.type === `wdio`)
            return ClientWdio.create({serverConfig: conf, capabilities: capabilities, clientName: clientName});

        throw new Error(`the client library called ${conf.automationFramework} is not implemented yet`)
    }

    public static attachToSession(conf: ServerConfig, capabilities: DesiredCapabilities, sessionId: string, clientName?: string): Browser {
        if (!conf.automationFramework || !conf.automationFramework.type || conf.automationFramework.type === `wdio`)
            return ClientWdio.create({serverConfig: conf, capabilities: capabilities, sessionId: sessionId, clientName: clientName});

        throw new Error(`the client library called ${conf.automationFramework} is not implemented yet`)
    }

    public static cleanup(browserToClean?: Browser[]): Promise<void[]> {
        return ClientWdio.cleanup(browserToClean);
    }

    public static get availableBrowser(): string[] {
        return [...ClientWdio.availableClients]
    }

    public static getClient(clientName: string): Browser | undefined {
        return ClientWdio.getClientByName(clientName)
    }

    public static takeScreenshots(): Promise<BrowserScreenshotData[]> {
        return Promise.all([ClientWdio.takeScreenshots()])
            .then((screenshots: BrowserScreenshotData[][]) => {
                return _.flatten(screenshots)
            });
    }

    public static saveScreenshots(filepath: string, baseFileName: string): Promise<string[]> {
        return Promise.all([
            ClientWdio.saveScreenshots(filepath, baseFileName)])
            .then((screenshots: string[][]) => {
                return _.flatten(screenshots)
            });
    }
}

const cleanUpLogger = getLogger(`CLEANUP  FUNCTION`);
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
                cleanUpLogger.debug(`Quit browser:`);
                return browser.quit();
            })
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((result: any[]): any[] => {
            cleanUpLogger.debug(`Clear BrowserMap BEFORE ${browserMap.size} : ${[...browserMap.keys()]}`);
            browserMap.clear();
            cleanUpLogger.debug(`Clear BrowserMap AFTER ${browserMap.size}`);
            return result;
        }).catch((e: Error) => {
            cleanUpLogger.debug(`Caught Error while deleting client sessions. ${e}`);
            browserMap.clear();
            // in case a session delete went wrong just return an empty Array
            return [];
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

export const switchToMasterFrame = async (client: Client): Promise<Client> => {
    // @ts-ignore
    if(client.isMobile) {
        const context = await client.getContext();

        if (context == `NATIVE_APP`)
            return Promise.resolve(client);
    }

    return (client.switchToFrame(null) as unknown as Promise<void>)
        .then((): Client => client)
};