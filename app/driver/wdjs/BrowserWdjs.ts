import {getLogger, Logger} from "@log4js-node/log4js-api";

import {Builder, promise, Session, ThenableWebDriver, WebDriver, WebElement, Capabilities} from "selenium-webdriver";
import {Executor, HttpClient}                                                from "selenium-webdriver/http";
import {DesiredCapabilities, ProxyConfig}                                    from "../../config/DesiredCapabilities";
import {ServerConfig}                                                        from "../../config/ServerConfig";

import {Browser, BrowserScreenshotData, CreateClient} from "../interface/Browser";
import {BrowserWindow, WindowManager}                 from "../interface/BrowserWindow";
import {ClientCtrls}                                  from "../interface/ClientCtrls";
import {TkSession}                                    from "../interface/TkSession";
import {cleanupClients, executeFnOnClient}            from "../lib/client/ClientHelper";
import {checkClientName}                              from "../lib/client/checks";
import {saveScreenshots, takeScreenshots}             from "../lib/client/screenshots";
import {waitForCondition}                       from "../lib/client/wait_actions";
import {scrollTo}                               from "../lib/client_side_scripts/scroll_page";
import {By}                                     from "../lib/element/Locator";
import {WebElementFinder, WebElementListFinder} from "../interface/WebElements";
import {getServerUrl}                           from "../lib/config/url_formatter";
import {BrowserWindowWdjs}                      from "./BrowserWindowWdjs";
import {FrameElementWdjs}                       from "./FrameElementWdjs";
import {SessionJS}                              from "./wrapper/SessionJS";
import {WebElementJS}                           from "./wrapper/WebElementJS";
import {LocatorWdjs}                            from "./LocatorWdjs";
import {WebElementListWdjs}                     from "./WebElementListWdjs";
import * as path                                from "path";
import * as fs                                  from "fs";
import fsExtra                                  from "fs-extra";
import {WebElementWdjs}                         from "./WebElementWdjs";


promise.USE_PROMISE_MANAGER = false;

export class BrowserWdjs implements Browser, ClientCtrls<WebDriver>, WindowManager {
    private static logger: Logger = getLogger(`BrowserWdjsClass`);
    private static browserMap: Map<string, Browser> = new Map<string, Browser>();

    private logger: Logger = getLogger(`BrowserWdjs`);
    private _window: BrowserWindow;
    private driverCreated: boolean = false;

    private constructor(
        private getDrvr: () => Promise<WebDriver>,
        private _selConfig: ServerConfig,
        private browserName: string = ``) {
    }

    public getFrameWorkClient = (): Promise<WebDriver> => {
        return this.getDrvr()
            .then((driver: WebDriver) => {
                if (!this.driverCreated) {
                    // ignoring Promise on purpose
                    this._window.setToPreset();
                }
                this.driverCreated = true;
                return driver;
            })
    };

    public get annotateElement(): boolean | undefined {
        return this._selConfig.annotateElement
    }

    public get displayTestMessages(): boolean | undefined {
        return this._selConfig.displayTestMessages
    }

    public get window(): BrowserWindow {
        return this._window;
    }

    /**
     * start a new browser instance for the given Config
     * @param selConf - the selenium config for which the browser has to be created
     * @param capabilities - the browser capabilities
     * @param browserName - a unique browser name
     *
     * @returns - browser instance
     * @throws - Error in case the given browser name is empty or already exists
     */
    public static create( {
        serverConfig,
        capabilities,
        clientName = `client${this.browserMap.size + 1}`,
        sessionId
    }: CreateClient): Browser {

        checkClientName(clientName);

        if (this.browserMap.has(clientName)) {
            throw new Error(`client name '${clientName}' already exists, choose another one`);
        }

        let builder: Builder = new Builder();
        try {
            // const capa: DesiredCapabilities = typeof capabilities === "function" ? capabilities() : capabilities;
            const capa: DesiredCapabilities = capabilities;

            builder = builder.usingServer(getServerUrl(serverConfig.serverAddress));
            builder.withCapabilities(capa);
            this.setProxy(builder, capa.proxy);

            const getDriver = (): () => Promise<WebDriver> => {
                let driver: WebDriver;
                return (): Promise<WebDriver> => {
                    return new Promise((resolve, reject): void => {
                        if (driver)
                            return resolve(driver);

                        // if a sessionId was passed attach to this session
                        if(sessionId) {
                            const client: HttpClient = new HttpClient(getServerUrl(serverConfig.serverAddress));
                            const executor: Executor = new Executor(client);
                            const session: Session = new Session(sessionId, capabilities);

                            driver = new WebDriver(session, executor);

                            resolve(driver);
                            return;
                        }

                        // create a new driver from the config
                        const drv: ThenableWebDriver = builder.build();
                        drv.then((): void => {
                            driver = drv as WebDriver;
                            resolve(driver);
                        }, reject);
                        return;

                    })
                }
            };

            const getTheDriver = getDriver();

            const browser = new BrowserWdjs(getTheDriver, serverConfig, clientName);
            const window = BrowserWindowWdjs.create(browser.getFrameWorkClient, capa.window);
            browser.windowManagedBy(window);

            this.browserMap.set(clientName, browser);
            return browser;

        } catch (e) {
            throw ` ${e} ${Error().stack}`;
        }
    }

    // public static attachToSession(
    //     selConf: ServerConfig,
    //     capabilities: DesiredCapabilities,
    //     sessionId: string,
    //     browserName: string = `client${this.browserMap.size + 1}`): Browser {
    //
    //     const getDriver = (): () => Promise<WebDriver> => {
    //         let driver: WebDriver;
    //         return (): Promise<WebDriver> => {
    //             return new Promise((resolve, reject): void => {
    //                 if (driver)
    //                     return resolve(driver);
    //
    //             })
    //         }
    //     };
    //
    //     const browser = new BrowserWdjs(getDriver(), selConf, browserName);
    //     const window = BrowserWindowWdjs.create(browser.getFrameWorkClient, capabilities.window);
    //     browser.windowManagedBy(window);
    //
    //     this.browserMap.set(browserName, browser);
    //     return browser;
    // }

    public windowManagedBy(window: BrowserWindow): void {
        this._window = window;
    }

    /**
     * set the proxy for the browser
     * @param builder - the builder the proxy will be set for
     * @param proxy - the Proxy config which will be set
     */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static setProxy = (builder: Builder, proxy: ProxyConfig | undefined): any => {
        if (proxy === undefined) return;

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const proxyWdjs = require(`selenium-webdriver/proxy`);

        if (proxy.type === `direct`) return builder.setProxy(proxyWdjs.direct());
        if (proxy.type === `system`) return builder.setProxy(proxyWdjs.system());

        if (proxy.type === `manual`) {
            if (!proxy.manualConfig) {
                const message = `You specified 'manual' proxy configuration in the capabilities but did not give a manual proxy config.`;
                BrowserWdjs.logger.info(message);
                throw new Error(message);
            }
            return builder.setProxy(proxyWdjs.manual(proxy.manualConfig))
        }
    };

    /**
     * close all browser created with BrowserWdjs.startedOn method
     *
     * @returns - resolved Promise after all browsers are closed
     */

    public static cleanup(browserToClean?: Browser[]): Promise<void[]> {
        return cleanupClients(this.browserMap, browserToClean)
    }


    /**
     * create screenshots of all browser created with BrowserWdjs.create()
     *
     * @returns - an array of BrowserScreenshotData objects,
     * an object contains the browser name and the screenshot data
     */
    public static takeScreenshots(): Promise<BrowserScreenshotData[]> {
        return takeScreenshots(this.browserMap);
    }

    /**
     * save all browser screenshots to the given directory
     * prefix the given file name (baseFileName) with the browser name
     * @param filepath - the directory where the files shall be saved
     * @param baseFileName - the filename which will be prefixed by the browser name
     *
     * @returns - array of the screenshots file names
     */
    public static saveScreenshots(filepath: string, baseFileName: string): Promise<string[]> {
        return saveScreenshots(this.browserMap)(filepath, baseFileName)
    }

    /**
     * return all names of currently available browser
     *
     * @returns - Array of browser names
     */
    public static get availableBrowser(): string[] {
        return [...this.browserMap.keys()];
    }

    /**
     * return the browser by the given name
     * @param browserName -  the name of the browser
     *
     * @returns  - the browser for the given name
     *
     * @throws - an Error in case not browser was found for the given browser name
     */
    public static getBrowser(browserName: string): Browser {
        const browser = this.browserMap.get(browserName);
        if (browser)
            return browser;
        else
            throw new Error(`cant find name browser with name '${browserName}'`);
    }


    /**
     * web element finder
     * @param locator - locator of the web element
     */
    public element(
        locator: By): WebElementFinder {

        return (this.all(locator) as WebElementListWdjs).toWebElement();
    }

    /**
     * web element array finder
     * @param locator - locator of the web element array finder
     */
    public all(
        locator: By): WebElementListFinder {

        const loc = LocatorWdjs.getSelector(locator);
        let getElements = async (): Promise<WebElementJS[]> => {
            // always switch to the main Window
            // if you want to deal with an element in a frame DO:
            // frame(By.css("locator")).element(By.css("locator"))
            return await this.getFrameWorkClient()
                .then((driver): promise.Promise<WebElementJS[]> => {
                    return driver.switchTo().defaultContent()
                        .then((): promise.Promise<WebElementJS[]> => {

                            return driver.findElements(loc).then((elements: WebElement[]): WebElementJS[] => {
                                this.logger.trace(`Found ${elements ? elements.length : 0} element(s) for locator '${locator}'`);
                                return WebElementJS.createAll(elements, driver);
                            })
                        });
                })
            // return await this._driver.findElements(loc);
        };

        return new WebElementListWdjs(getElements, locator, this, WebElementWdjs.create);
    }

    public frame(locator: By): FrameElementWdjs {
        const loc = LocatorWdjs.getSelector(locator);

        const getFrames = async (): Promise<WebElementJS[]> => {
            return await this.getFrameWorkClient()
                .then((driver): promise.Promise<WebElementJS[]> => {
                    return driver.switchTo().defaultContent()
                        .then((): promise.Promise<WebElementJS[]> => {

                            return driver.findElements(loc).then((elements: WebElement[]): WebElementJS[] => {
                                this.logger.trace(`Found ${elements ? elements.length : `undefined`} frame(s) for locator '${locator}'`);
                                return WebElementJS.createAll(elements, driver);
                            })
                        });
                })
        };

        return new FrameElementWdjs(getFrames, locator, this, FrameElementWdjs.create);
    }

    /**
     * load the given address
     * if the url does not start with http*, it will be prefixed with the base url if it exists
     * @param destination
     */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public get(destination: string): Promise<any> {
        let _destination = this._selConfig.baseUrl && !destination.startsWith(`http`) ? `${this._selConfig.baseUrl}${destination}` : destination;
        return new Promise((fulfill, reject): void => {
            this.getFrameWorkClient()
                .then((driver): void => {
                    driver.get(_destination)
                        .then(fulfill, reject)
                })
                .catch(reject)
        })
    }

    public getCurrentUrl(): Promise<string> {
        return new Promise((resolve, reject): void => {
            this.getFrameWorkClient()
                .then((driver): void => {
                    driver.getCurrentUrl()
                        .then(resolve, reject)
                })
                .catch(reject)
        })
    }

    /**
     * close the browser
     */
    public quit(): Promise<void> {
        return new Promise((fulfill, reject): void => {
            if (!this.driverCreated) {
                return fulfill();
            }

            this.getFrameWorkClient()
                .then((driver): void => {
                    driver.quit()
                        .then(fulfill, reject)
                })
                .catch(reject)
        })
    }

    /**
     * return the browsers title
     */
    public getTitle(): Promise<string> {
        return executeFnOnClient(this.getFrameWorkClient, `getTitle`, [])
    }

    /**
     * checks if the browser has the given title
     * @param expectedTitle
     */
    public hasTitle(expectedTitle: string): Promise<boolean> {
        return new Promise((fulfill, reject): void => {
            this.getFrameWorkClient()
                .then((driver): void => {
                    driver.getTitle()
                        .then((title): void => fulfill(title === expectedTitle), reject)
                })
                .catch(reject);
        })
    }

    /**
     * returns the browsers screenshot as an base64 encoded png file
     */
    public takeScreenshot(): Promise<BrowserScreenshotData> {
        return new Promise((resolve, reject): void => {
            this.getFrameWorkClient()
                .then((driver): void => {
                    driver.takeScreenshot()
                        .then((data: string): void => {
                            const screenshotData: BrowserScreenshotData = {
                                browserName: this.browserName,
                                browserScreenshotData: data
                            };
                            return resolve(screenshotData)
                        }, reject)
                })
                .catch(reject);
        })
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

    /**
     * waits for the condition to continue
     * @param condition - the condition to wait for
     * @param timeout - stop waiting after the given time in ms
     * @param waitMessage - the message will be used in returned error and success message
     *
     * @returns - a Promise containing the success or error message
     */
    public wait = waitForCondition(this.logger);

    public scrollTo({x, y}: { x: number; y: number }): Promise<void> {
        return new Promise(async (resolve, reject): Promise<void> => {
            const driver = await this.getFrameWorkClient();

            driver.executeScript(scrollTo, {x, y})
                .then(() => {
                    resolve();
                }, reject)
                .catch(reject)
        });
    }

    //eslint-disable-next-line @typescript-eslint/explicit-function-return-type @typescript-eslint/no-explicit-any
    public executeScript(func: Function, ...funArgs: any[]): Promise<{}> {
        return new Promise((resolve, reject): void => {
            this.getFrameWorkClient()
                .then((driver): promise.Promise<{}> => driver.executeScript(func, funArgs))
                .then(resolve, reject)
                .catch(reject)
        });

    }

    public getSession(): Promise<TkSession> {
        return new Promise((resolve, reject) => {
            this.getFrameWorkClient()
                .then(async (client: WebDriver): Promise<void> => {
                    const session = await client.getSession();
                    resolve(SessionJS.create(session));
                })
                .catch(reject)
        });
    }
}