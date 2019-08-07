import {getLogger, Logger}                                          from "@log4js-node/log4js-api";
import {Browser, BrowserScreenshotData}                             from "../interface/Browser";
import {BrowserWindow}                                              from "../interface/BrowserWindow";
import {FrameElementFinder, WebElementFinder, WebElementListFinder} from "../interface/WebElements";
import {By, DesiredCapabilities, ServerConfig}                      from "../..";
import {cleanupClients, executeFnOnClient}                          from "../lib/BrowserHelper";
import {checkClientName}                                            from "../lib/checks";
import {Condition}                                                  from "../lib/Condition";
import {transformToWdioConfig}                                      from "../lib/config_transformation";
import {UntilElementCondition}                                      from "../lib/ElementConditions";

import WebDriver, { Client } from 'webdriver'



export class ClientWdio implements Browser {
    private static logger: Logger = getLogger(`ClientWdioClass`);

    private clientCreated: boolean = false;
    private _window: BrowserWindow;
    private static clientMap: Map<string, Browser> = new Map<string, Browser>();

    private constructor(
        private getClnt: () => Promise<Client>,
        private _selConfig: ServerConfig,
        private browserName: string = ``) {
    }

    public get window(): BrowserWindow {
        return this._window;
    }

    public static create(
        serverConfig: ServerConfig,
        capabilities: DesiredCapabilities,
        clientName: string = `client${this.clientMap.size + 1}`): ClientWdio {

        checkClientName(clientName);

        try {
            const wdioOpts = transformToWdioConfig(serverConfig, capabilities);

            const getClient = (): () => Promise<Client> => {
                let client: Client;
                return (): Promise<Client> => {
                    return new Promise(async (resolve, reject): Promise<void> => {
                        if (client)
                            return resolve(client);
                        const drv: Client = await WebDriver.newSession(wdioOpts);

                        client = drv as Client;
                        resolve(client);

                    })
                }
            };

            const getTheDriver = getClient();

            const client = new ClientWdio(getTheDriver, serverConfig, clientName);
            // const window = BrowserWindowWdio.create(getTheDriver, capa.window);
            // client.windowManagedBy(window);

            this.clientMap.set(clientName, client);
            return client;

        } catch (e) {
            throw ` ${e} ${Error().stack}`;
        }

    }

    public getDriver = (): Promise<Client> => {
        return this.getClnt()
            .then((driver): Client => {
                if(!this.clientCreated) {
                    // ignoring Promise on purpose
                    // this._window.setToPreset();
                }
                this.clientCreated = true;
                return driver;
            })
    };

    public static cleanup(clientsToClean?: Browser[]): Promise<void[]> {
        return cleanupClients(this.clientMap, clientsToClean)
    }

    /**
     * return all names of currently available clients
     *
     * @returns - Array of client names
     */
    public static get availableClients(): string[] {
        return [...this.clientMap.keys()];
    }

    /**
     * return the client by the given name
     * @param clientName -  the name of the client
     *
     * @returns  - the client for the given name
     *
     * @throws - an Error in case no client instance was found for the given client name
     */
    public static getClient(clientName: string): Browser {
        const client = this.clientMap.get(clientName);
        if (client)
            return client;
        else
            throw new Error(`cant find name client with name '${clientName}'`);
    }

    public all(locator: By): WebElementListFinder {
        throw new Error(`all() not implemented yet`);
    }

    public element(locator: By): WebElementFinder {
        throw new Error(`element() not implemented yet`);
    }

    public executeScript(func: Function, ...funcArgs: any[]): Promise<{}> {
        throw new Error(`executeScript() not implemented yet`)
    }

    public frame(locator: By): FrameElementFinder {
        throw new Error(`frame() not implemented yet`)
    }

    public get(url: string): Promise<void> {
        return executeFnOnClient(this.getDriver, `navigateTo`, [url])
    }

    public getCurrentUrl(): Promise<string> {
        throw new Error(`getCurrentUrl() not implemented yet`)
    }

    public getTitle(): Promise<string> {
        return executeFnOnClient(this.getDriver, `getTitle`,[])
    }

    public hasTitle(expectedTitle: string): Promise<boolean> {
        return this.getTitle()
            .then((title): boolean => (title === expectedTitle))
    }

    public quit(): Promise<void> {
        if(!this.clientCreated) {
            return Promise.resolve();
        }
        return executeFnOnClient(this.getDriver, `deleteSession`, [])
    }

    public saveScreenshot(filepath: string, filename: string): Promise<string> {
        throw new Error(`saveScreenshot() not implemented yet`)
    }

    public scrollTo({x, y}: { x: number; y: number }): Promise<void> {
        throw new Error(`scrollTo() not implemented yet`)
    }

    public takeScreenshot(): Promise<BrowserScreenshotData> {
        throw new Error(`takeScreenshot() not implemented yet`)
    }

    public wait(condition: Condition, timeout?: number, errorMessage?: string): Promise<string> {
        throw new Error(`wait() not implemented yet`)
    }

    public wait2(condition: UntilElementCondition, element: WebElementFinder, errorMessage?: string): Promise<string> {
        throw new Error(`wait2() not implemented yet`)
    }

}