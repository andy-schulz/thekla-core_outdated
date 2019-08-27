import {getLogger, Logger}                            from "@log4js-node/log4js-api";
import * as fs                                        from "fs";
import fsExtra                                        from "fs-extra";
import * as path                                      from "path";
import {PointerActionSequence}                        from "../interface/Actions";
import {Browser, BrowserScreenshotData, CreateClient} from "../interface/Browser";
import {BrowserWindow, WindowManager}                 from "../interface/BrowserWindow";
import {ClientCtrls}                                  from "../interface/ClientCtrls";
import {TkSession}                                    from "../interface/TkSession";
import {TkWebElement}                                 from "../interface/TkWebElement";
import {FrameElementFinder, WebElementFinder, WebElementListFinder} from "../interface/WebElements";
import {By, ServerConfig}                                           from "../..";
import {cleanupClients, executeFnOnClient, switchToMasterFrame}     from "../lib/client/ClientHelper";
import {checkClientName}                                            from "../lib/client/checks";
import {formatNavigateToUrl}                                        from "../lib/client/url_formatter";
import {waitForCondition}                                           from "../lib/client/wait_actions";
import {scrollTo}                                                   from "../lib/client_side_scripts/scroll_page";
import {transformToWdioConfig}                                      from "../lib/config/config_transformation";
import WebDriver, {Client}                                          from 'webdriver'
import {funcToString}                                               from "../utils/Utils";
import {FrameElementWdio}                                           from "./FrameElementWdio";
import {LocatorWdio}                                                from "./LocatorWdio";
import {SessionIO}                                                  from "./wrapper/SessionIO";
import {ElementRefIO, WebElementIO}                                 from "./wrapper/WebElementIO";
import {WebElementListWdio}                                         from "./WebElementListWdio";
import {BrowserWindowWdio}                                          from "./BrowserWindowWdio";
import {takeScreenshots, saveScreenshots}                           from "../lib/client/screenshots";
import deepmerge                                                    from "deepmerge";
import AttachSessionOptions = WebDriver.AttachSessionOptions;

export class ClientWdio implements Browser, ClientCtrls<Client>, WindowManager {
    private static logger: Logger = getLogger(`ClientWdioClass`);
    private logger: Logger = getLogger(`ClientWdio`);

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

    public windowManagedBy(window: BrowserWindow): void {
        this._window = window;
    }

    public get annotateElement(): boolean | undefined {
        return this._selConfig.annotateElement
    }

    public get displayTestMessages(): boolean | undefined {
        return this._selConfig.displayTestMessages
    }

    public static create(
        {
            serverConfig,
            capabilities,
            clientName = `client${this.clientMap.size + 1}`,
            sessionId
        }: CreateClient
    ): ClientWdio {

        checkClientName(clientName);

        try {
            const wdioOpts = transformToWdioConfig(serverConfig, capabilities);

            const getClient = (): () => Promise<Client> => {
                let client: Client;
                return (): Promise<Client> => {
                    return new Promise(async (resolve, reject): Promise<void> => {
                        if (client)
                            return resolve(client);

                        if (sessionId) {
                            const attachOptions: AttachSessionOptions = deepmerge(wdioOpts, {sessionId: sessionId});
                            client = (await WebDriver.attachToSession(attachOptions)) as unknown as Client;
                            resolve(client);
                            return;
                        }

                        WebDriver.newSession(wdioOpts)
                            .then((clnt: Client): void => {
                                client = clnt as Client;
                                resolve(client);
                            }, reject)
                            .catch(reject);
                    })
                }
            };

            const getTheDriver = getClient();

            const client = new ClientWdio(getTheDriver, serverConfig, clientName);
            const window = BrowserWindowWdio.create(client.getFrameWorkClient, capabilities.window);
            client.windowManagedBy(window);

            this.clientMap.set(clientName, client);
            return client;

        } catch (e) {
            throw ` ${e} ${Error().stack}`;
        }

    }

    public getFrameWorkClient = (): Promise<Client> => {
        return this.getClnt()
            .then((driver): Client => {
                if (!this.clientCreated) {
                    // ignoring Promise on purpose
                    this._window.setToPreset();
                }
                this.clientCreated = true;
                return driver;
            }).catch((e: Error) => {
                return Promise.reject(e)
            })
    };

    public pointerButtonDown = (button: number): (pr: Promise<void>) => Promise<void> => {
        return (pr: Promise<void>): Promise<void> => {

            const buttonPress: PointerActionSequence[] = [{
                type: `pointer`,
                id: `myMouse`,
                parameters: {pointerType: `mouse`},
                actions: [{
                    type: `pointerDown`,
                    button: button
                }, {
                    type: `pause`,
                    duration: 200
                }]
            }];

            return pr.then(this.getFrameWorkClient)
                .then((client: Client): Promise<void> => {
                    return client.performActions(buttonPress) as unknown as Promise<void>
                });
        }
    };

    public pointerButtonUp = (button: number): (pr: Promise<void>) => Promise<void> => {
        return (pr: Promise<void>): Promise<void> => {

            const buttonUp: PointerActionSequence[] = [{
                type: `pointer`,
                id: `myMouse`,
                parameters: {pointerType: `mouse`},
                actions: [{
                    type: `pointerUp`,
                    button: button
                }, {
                    type: `pause`,
                    duration: 200
                }]
            }];

            return pr.then(this.getFrameWorkClient)
                .then((client: Client): Promise<void> => {
                    return client.performActions(buttonUp) as unknown as Promise<void>
                });
        }
    };

    public releaseActions = (pr: Promise<void>): Promise<void> => {
        return pr
            .then(this.getFrameWorkClient)
            .then((client: Client): Promise<void> => client.releaseActions() as unknown as Promise<void>)

    };

    public static cleanup(clientsToClean?: Browser[]): Promise<void[]> {
        return cleanupClients(this.clientMap, clientsToClean)
    }

    /**
     * startedOn screenshots of all browser created with BrowserWdjs.startedOn
     *
     * @returns - and array of BrowserScreenshotData objects, the object contains the browser name and the screenshot data
     */
    public static takeScreenshots(): Promise<BrowserScreenshotData[]> {
        return takeScreenshots(this.clientMap);
    }

    /**
     * save all client screenshots to the given directory
     * prefix the given file name (baseFileName) with the client name
     * @param filepath - the directory where the files shall be saved
     * @param baseFileName - the filename which will be prefixed by the client name
     *
     * @returns - array of the screenshots file names
     */
    public static saveScreenshots(filepath: string, baseFileName: string): Promise<string[]> {
        return saveScreenshots(this.clientMap)(filepath, baseFileName)
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

        const loc = LocatorWdio.getSelectorParams(locator);
        let getElements = async (): Promise<TkWebElement[]> => {
            // always switch to the main Window
            // if you want to deal with an element in a frame DO:
            // frame(By.css("locator")).element(By.css("locator"))
            return await this.getFrameWorkClient()
                .then((driver): Promise<TkWebElement[]> => {
                    return (switchToMasterFrame(driver))
                        .then((): Promise<TkWebElement[]> => {

                            return (driver.findElements(loc[0], loc[1]) as unknown as Promise<ElementRefIO[]>)
                                .then((elements: ElementRefIO[]): TkWebElement[] => {
                                    this.logger.trace(`Found ${elements ? elements.length : 0} element(s) for locator '${locator}'`);

                                    return WebElementIO.createAll(elements, driver);
                                })
                        });
                })
            // return await this._driver.findElements(loc);
        };

        return new WebElementListWdio(getElements, locator, this);
    }

    public element(locator: By): WebElementFinder {
        return (this.all(locator) as WebElementListWdio).toWebElement();
    }

    public executeScript(func: Function, ...funcArgs: any[]): Promise<{}> {
        const funcString = `return (${func}).apply(null, arguments);`;
        return executeFnOnClient(this.getFrameWorkClient, `executeScript`, [funcString, funcArgs])
    }

    public frame(locator: By): FrameElementFinder {
        const loc = LocatorWdio.getSelectorParams(locator);

        const getFrames = async (): Promise<WebElementIO[]> => {
            return await this.getFrameWorkClient()
                .then((driver): Promise<WebElementIO[]> => {
                    return switchToMasterFrame(driver)
                        .then((): Promise<WebElementIO[]> => {
                            return (driver.findElements(loc[0], loc[1]) as unknown as Promise<ElementRefIO[]>)
                                .then((elements: ElementRefIO[]): WebElementIO[] => {
                                    this.logger.trace(`Found ${elements ? elements.length : `undefined`} frame(s) for locator '${locator}'`);
                                    return WebElementIO.createAll(elements, driver);
                                })
                        });
                })
        };

        return new FrameElementWdio(getFrames, locator, this, FrameElementWdio.create);
    }

    public get(url: string): Promise<void> {
        const destination = formatNavigateToUrl(this._selConfig, url);
        return executeFnOnClient(this.getFrameWorkClient, `navigateTo`, [destination])
    }

    public getCurrentUrl(): Promise<string> {
        return executeFnOnClient(this.getFrameWorkClient, `getUrl`)
    }

    public getTitle(): Promise<string> {
        return executeFnOnClient(this.getFrameWorkClient, `getTitle`)
    }

    public hasTitle(expectedTitle: string): Promise<boolean> {
        return this.getTitle()
            .then((title): boolean => (title === expectedTitle))
    }

    public quit(): Promise<void> {
        if (!this.clientCreated) {
            return Promise.resolve();
        }
        return executeFnOnClient(this.getFrameWorkClient, `deleteSession`, [])
    }

    /**
     * save the browser screenshot to file
     * @param filepath - absolute or relative path to file
     * @param filename - filename
     *
     * @returns Promise with path to saved file
     */
    public saveScreenshot(filepath: string, filename: string): Promise<string> {
        let fp: string = filepath;
        if (!path.isAbsolute(fp)) {
            fp = `${process.cwd()}/${fp}`;
        }

        try {
            if (!fs.existsSync(fp))
                fsExtra.mkdirsSync(fp);
        } catch (e) {
            return Promise.reject(e)
        }

        const fpn = `${fp}/${filename}`;

        return new Promise((resolve, reject): void => {
            this.takeScreenshot()
                .then((data: BrowserScreenshotData): void => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    fs.writeFile(fpn, data.browserScreenshotData, `base64`, (err: any): void => {
                        if (err)
                            return reject(err);
                        resolve(fpn);
                    });
                });

        });
    }

    public scrollTo({x, y}: { x: number; y: number }): Promise<void> {
        return this.getFrameWorkClient()
            .then((client: Client): Promise<void> => {
                return client.executeScript(funcToString(scrollTo), [{x, y}])
            })
    }

    public takeScreenshot(): Promise<BrowserScreenshotData> {
        return this.getFrameWorkClient()
            .then((client: Client): Promise<BrowserScreenshotData> => {
                return (client.takeScreenshot() as unknown as Promise<string>)
                    .then((data: string): BrowserScreenshotData => {
                        const screenshotData: BrowserScreenshotData = {
                            browserName: this.browserName,
                            browserScreenshotData: data
                        };
                        return screenshotData;
                    })
            })
    }

    public wait = waitForCondition(this.logger);

    public getSession(): Promise<TkSession> {
        return new Promise((resolve, reject) => {
            this.getFrameWorkClient()
                .then(async (client: Client): Promise<void> => {
                    // @ts-ignore
                    resolve(SessionIO.create({sessionId: client.sessionId, capabilities: client.capabilities}));
                })
                .catch(reject)
        });
    }
}