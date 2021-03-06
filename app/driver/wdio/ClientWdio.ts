import {getLogger, Logger}                                               from "@log4js-node/log4js-api";
import * as fs                                                           from "fs";
import fsExtra                                                           from "fs-extra";
import * as path                                                         from "path";
import {PointerActionSequence}                                           from "../interface/Actions";
import {Browser, BrowserScreenshotData, CreateClient, ScreenshotOptions} from "../interface/Browser";
import {BrowserWindow, WindowManager}                                    from "../interface/BrowserWindow";
import {ClientCtrls}                                                     from "../interface/ClientCtrls";
import {TkSession}                                                       from "../interface/TkSession";
import {TkWebElement}                                                    from "../interface/TkWebElement";
import {FrameElementFinder, WebElementFinder, WebElementListFinder}      from "../interface/WebElements";
import {By, ServerConfig}                                           from "../..";
import {cleanupClients, executeFnOnClient, switchToMasterFrame}     from "../lib/client/ClientHelper";
import {checkClientName}                                            from "../lib/client/checks";
import {formatNavigateToUrl}              from "../lib/client/url_formatter";
import {waitForCondition}                 from "../lib/client/wait_actions";
import {scrollTo}                         from "../lib/client_side_scripts/scroll_page";
import {transformToWdioConfig}            from "../lib/config/config_transformation";
import WebDriver, {Client}                from 'webdriver'
import {Point}                            from "../lib/element/ElementLocation";
import {funcToString}                     from "../utils/Utils";
import {FrameElementWdio}                 from "./FrameElementWdio";
import {LocatorWdio}                      from "./LocatorWdio";
import {SessionIO}                        from "./wrapper/SessionIO";
import {WebElementListWdio}               from "./WebElementListWdio";
import {BrowserWindowWdio}                from "./BrowserWindowWdio";
import {takeScreenshots, saveScreenshots} from "../lib/client/screenshots";
import deepmerge                          from "deepmerge";
import AttachSessionOptions = WebDriver.AttachSessionOptions;

import { AnnotatorWdio } from "../../packages/annotator/AnnotatorWdio";
import { processScreenshot } from "../lib/client/client_utils";

export class ClientWdio implements Browser, ClientCtrls<Client>, WindowManager {
    private static logger: Logger = getLogger(`ClientWdioClass`);
    private logger: Logger = getLogger(`ClientWdio`);

    private clientCreated = false;
    private _window: BrowserWindow;
    private static clientMap: Map<string, Browser> = new Map<string, Browser>();
    private static attachedClientMap: Map<string, Browser> = new Map<string, Browser>();

    private constructor(
        private getClnt: () => Promise<Client>,
        private _selConfig: ServerConfig,
        private _capabilities: {[key: string]: any},
        private browserName: string = ``) {
    }

    private resetAnnotator = (shallAnnotate: boolean | undefined): (driver: Client) => Promise<Client> => {
        return (driver: Client): Promise<Client> => {
            return shallAnnotate ? AnnotatorWdio.resetHighlighter(driver) : Promise.resolve(driver)
        };
    };

    public get window(): BrowserWindow {
        return this._window;
    }

    public get capabilities(): {[key: string]: any} {
        return this._capabilities;
    }

    public windowManagedBy(window: BrowserWindow): void {
        this._window = window;
    }

    public get serverConfig(): ServerConfig {
        return this._selConfig;
    }

    public pointerButtonDown = (button: number): (client: Client) => Promise<Client> => {
        return (client: Client): Promise<Client> => {

            const buttonPress: PointerActionSequence[] = [{
                type: `pointer`,
                id: `myMouse`,
                parameters: {pointerType: `mouse`},
                actions: [{
                    type: `pointerDown`,
                    button: button
                }]
            }];

            return (client.performActions(buttonPress) as unknown as Promise<void>)
                .then(() => client)

        }
    };

    public pointerButtonUp = (button: number): (client: Client) => Promise<Client> => {
        return (client: Client): Promise<Client> => {

            const buttonUp: PointerActionSequence[] = [{
                type: `pointer`,
                id: `myMouse`,
                parameters: {pointerType: `mouse`},
                actions: [{
                    type: `pointerUp`,
                    button: button
                }]
            }];

            return (client.performActions(buttonUp) as unknown as Promise<void>)
                .then(() => client)
        }
    };

    public movePointerTo = (point: Point): (client: Client) => Promise<Client> => {
        return (client: Client): Promise<Client> => {

            const moveTo: PointerActionSequence[] = [{
                type: `pointer`,
                id: `myMouse`,
                parameters: {pointerType: `mouse`},
                actions: [{
                    type: `pointerMove`,
                    origin: `pointer`,
                    duration: 200,
                    x: point.x,
                    y: point.y
                }]
            }];

            return (client.performActions(moveTo) as unknown as Promise<void>)
                .then(() => client)
        }
    };

    public releaseActions = (): (client: Client) => Promise<Client> => {
        return (client: Client): Promise<Client> => {
            return (client.releaseActions() as unknown as Promise<void>)
                .then((): Client => client)
        }
    };

    public getFrameWorkClient = (): Promise<Client> => {
        return this.getClnt()
            .then((driver): Client => {
                if (!this.clientCreated) {
                    // ignoring Promise on purpose
                    this._window.setToPreset();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    this._capabilities = driver.capabilities;
                }
                this.clientCreated = true;
                return driver;
            }).catch((e: Error) => {
                return Promise.reject(e)
            })
    };

    public static create({ serverConfig,
        capabilities,
        clientName = undefined,
        sessionId }: CreateClient): ClientWdio {

        // tsc always complains that clntName is undefined, the if statement is not taken into account as it seems
        let clntName: string = clientName ? clientName : ``;

        if(clientName === undefined || clientName === null) {
            clntName = sessionId ?
                `client${this.attachedClientMap.size + 1}` :
                `client${this.clientMap.size + 1}`;
        }

        checkClientName(clntName);

        try {
            const wdioOpts = transformToWdioConfig(serverConfig, capabilities);

            const getClient = (): () => Promise<Client> => {
                let client: Client;
                return (): Promise<Client> => {
                    return new Promise(async (resolve, reject): Promise<void> => {
                        if (client)
                            return resolve(client);

                        // if a session is passed attatch to the session
                        if (sessionId) {
                            const attachOptions: AttachSessionOptions = deepmerge(wdioOpts, {sessionId: sessionId});
                            client = (await WebDriver.attachToSession(attachOptions)) as unknown as Client;
                            return resolve(client);
                        }

                        // otherwise create a new Session
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

            const client = new ClientWdio(getTheDriver, serverConfig, capabilities, clntName);
            const window = BrowserWindowWdio.create(client.getFrameWorkClient, capabilities.window);
            client.windowManagedBy(window);

            if(sessionId) {
                this.attachedClientMap.set(clntName, client);
            } else {
                this.clientMap.set(clntName, client);
            }
            return client;

        } catch (e) {
            throw ` ${e} ${Error().stack}`;
        }

    }

    public static cleanup(clientsToClean?: Browser[], cleanAttachedSessions = false): Promise<void[]> {
        return cleanupClients(this.clientMap, clientsToClean)
            .then((promiseArr: void[]) => {
                if(cleanAttachedSessions)
                    return cleanupClients(this.attachedClientMap, clientsToClean)
                        .then((prArr: void[]): void[] => {
                            return [...promiseArr, ...prArr]
                        });
                return promiseArr
            })
    }

    /**
     * startedOn screenshots of all browser created with BrowserWdjs.startedOn
     *
     * @returns - and array of BrowserScreenshotData objects, the object contains the browser name and the screenshot data
     */
    public static takeScreenshots(options?: ScreenshotOptions): Promise<BrowserScreenshotData[]> {
        return takeScreenshots(this.clientMap, options);
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
     * return all names of newly created sessions
     *
     * @returns - Array of client names
     */
    public static get availableNewClients(): string[] {
        return [...this.clientMap.keys()];
    }

    /**
     * return all names of attached sessions
     *
     * @returns - Array of client names
     */
    public static get availableAttachedClients(): string[] {
        return [...this.attachedClientMap.keys()];
    }

    /**
     * return the client by the given name
     * @param clientName -  the name of the client
     *
     * @returns  - the client for the given name
     *
     * @throws - an Error in case no client instance was found for the given client name
     */
    public static getClientByName(clientName: string): Browser {
        const client = this.clientMap.get(clientName);
        if (client)
            return client;
        else
            throw new Error(`cant find name client with name '${clientName}'`);
    }

    public element(locator: By): WebElementFinder {
        return (this.all(locator) as WebElementListWdio).toWebElement();
    }

    public all(locator: By): WebElementListFinder {

        const getElements = async (): Promise<TkWebElement<Client>[]> => {
            // always switch to the main Window
            // if you want to deal with an element in a frame DO:
            // frame(By.css("locator")).element(By.css("locator"))
            return this.getFrameWorkClient()
                .then(switchToMasterFrame)
                .then(LocatorWdio.retrieveElements(locator))
        };

        return new WebElementListWdio(getElements, locator, this);
    }

    public frame(locator: By): FrameElementFinder {

        const getFrames = (): Promise<TkWebElement<Client>[]> => {
            return this.getFrameWorkClient()
                .then(switchToMasterFrame)
                .then(LocatorWdio.retrieveElements(locator))

        };
        return new FrameElementWdio(getFrames, locator, this, FrameElementWdio.create);
    }

    public get(url: string): Promise<void> {
        const destination = formatNavigateToUrl(this._selConfig, url);
        return this.getFrameWorkClient()
            .then(this.resetAnnotator(this.serverConfig.annotateElement))
            .then((): Promise<void> => {
                return executeFnOnClient(this.getFrameWorkClient, `navigateTo`, [destination])
            })
    }

    public getCurrentUrl(): Promise<string> {
        return executeFnOnClient(this.getFrameWorkClient, `getUrl`)
    }

    public getTitle(): Promise<string> {
        return executeFnOnClient(this.getFrameWorkClient, `getTitle`)
    }

    public executeScript(func: Function, ...funcArgs: any[]): Promise<{}> {
        const funcString = `return (${func}).apply(null, arguments);`;
        return executeFnOnClient(this.getFrameWorkClient, `executeScript`, [funcString, funcArgs])
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

    public takeScreenshot(options?: ScreenshotOptions): Promise<BrowserScreenshotData> {
        return this.getFrameWorkClient()
            .then((client: Client): Promise<BrowserScreenshotData> => {
                return (client.takeScreenshot() as unknown as Promise<string>)
                    .then(processScreenshot(options))
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
        return this.getFrameWorkClient()
            .then(SessionIO.create)
    }
}