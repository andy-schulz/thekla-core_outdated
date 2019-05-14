import {getLogger, Logger} from "@log4js-node/log4js-api";

import {Builder, promise, ThenableWebDriver, WebDriver, WebElement} from "selenium-webdriver";
import {
    DesiredCapabilities,
    ProxyConfig,
    SeleniumConfig
}                                                                   from "../../config/SeleniumConfig";

import {Browser, BrowserScreenshotData}         from "../interface/Browser";
import {BrowserWindow}                          from "../interface/BrowserWindow";
import {UntilElementCondition}                  from "../lib/ElementConditions";
import {By}                                     from "../lib/Locator";
import {WebElementFinder, WebElementListFinder} from "../interface/WebElements";
import {BrowserWindowWdjs}                      from "./BrowserWindowWdjs";
import {FrameElementWdjs}                       from "./FrameElementWdjs";
import {FrameHelper}                            from "./interfaces/WdElement";
import {LocatorWdjs}                            from "./LocatorWdjs";
import {ExecuteConditionWdjs}                   from "./ExecuteConditionWdjs";
import {WebElementListWdjs}                     from "./WebElementListWdjs";
import {Condition}                              from "../lib/Condition";
import * as path                                from "path";
import * as fs                                  from "fs";
import fsExtra                                  from "fs-extra";


promise.USE_PROMISE_MANAGER = false;

export class BrowserWdjs implements Browser {
    private static logger: Logger = getLogger(`BrowserWdjsClass`);
    private static browserMap: Map<string, Browser> = new Map<string, Browser>();

    private logger: Logger = getLogger(`BrowserWdjs`);
    private _window: BrowserWindow;
    private driverCreated: boolean = false;

    private constructor(
        private getDrvr: () => Promise<WebDriver>,
        private _selConfig: SeleniumConfig,
        private browserName: string = ``) {
    }

    // public findElement(WebDriver, ) {
    //
    // }

    public getDriver(): Promise<WebDriver> {
        return this.getDrvr()
            .then((driver): WebDriver => {
                if(!this.driverCreated) {
                    // ignoring Promise on purpose
                    this._window.setToPreset();
                }
                this.driverCreated = true;
                return driver;
            })
    }

    public get annotateElement() {
        return this._selConfig.annotateElement
    }

    public get displayTestMessages() {
        return this._selConfig.displayTestMessages
    }

    public get window(): BrowserWindow {
        return this._window;
    }

    /**
     * startedOn a new browser instance for the given Config
     * @param selConf - the selenium config for which the browser has to be created
     * @param capabilities - the browser capabilities
     * @param browserName - a unique browser name
     *
     * @returns - browser instance
     * @throws - Error in case the given browser name is empty or already exists
     */
    public static create(
        selConf: SeleniumConfig,
        capabilities: DesiredCapabilities,
        browserName: string = `browser${this.browserMap.size + 1}`): Browser {

        if (!browserName)
            throw new Error(`invalid browser name '${browserName}'`);

        const regex = /^[a-zA-Z0-9_\-]+$/;
        if (!browserName.match(regex))
            throw new Error(`browser name '${browserName}' contains invalid characters. Allowed characters are: [a-z]*[A-Z]*[_-]*[0-9]*`);

        if (this.browserMap.has(browserName)) {
            throw new Error(`browser name '${browserName}' already exists, choose another one`);
        }

        let builder: Builder = new Builder();
        try {
            // const capa: DesiredCapabilities = typeof capabilities === "function" ? capabilities() : capabilities;
            const capa: DesiredCapabilities = capabilities;

            builder = builder.usingServer(selConf.seleniumServerAddress);
            builder.withCapabilities(capa);
            this.setProxy(builder, capa.proxy);

            const getDriver = (): () => Promise<WebDriver> => {
                let driver: WebDriver;
                return (): Promise<WebDriver> => {
                    return new Promise((resolve, reject): void => {
                        if (driver)
                            return resolve(driver);
                        const drv: ThenableWebDriver = builder.build();
                        drv.then((): void => {
                            driver = drv as WebDriver;
                            resolve(driver);
                        }, reject);
                    })
                }
            };

            const getTheDriver = getDriver();

            const browser = new BrowserWdjs(getTheDriver, selConf, browserName);
            const window = BrowserWindowWdjs.create(getTheDriver, capa.window);
            browser.windowManagedBy(window);

            // const drv = await BrowserWdjs.buildDriver(builder);
            // const driver = <WebDriver>drv;
            // const browser = new BrowserWdjs(driver, selConf, capa, browserName);
            // try {
            //     const window = await BrowserWindowWdjs.create(driver, capa.window);
            //     browser.windowManagedBy(window);
            // } catch (e) {
            //     browser.quit();
            //     return Promise.reject(e);
            // }

            this.browserMap.set(browserName, browser);
            return browser;

        } catch (e) {
            throw ` ${e} ${Error().stack}`;
        }
    }

    // public getLocalDriver(): Promise<WebDriver | WebDriver> {
    //     if(this._driver) {
    //         return Promise.resolve(this._driver as WebDriver);
    //     }
    //
    //     return new Promise((resolve, reject) => {
    //         this.getDriver()
    //             .then((driver: WebDriver) => {
    //                 this._driver = driver;
    //                 resolve(driver);
    //             })
    //             .catch(reject)
    //     });
    // }

    // private static buildDriver(builder: Builder): Promise<WebDriver> {
    //     return new Promise((resolve, reject) => {
    //         const drv: WebDriver = builder.build();
    //
    //         drv.then(() => resolve(drv), reject);
    //     })
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

        if (browserToClean) {
            let browserCleanupPromises: Promise<void>[] = [];

            const entries = [...this.browserMap.entries()];
            browserToClean.map((browser: Browser): void => {
                entries.map((browserEntry: [string, Browser]): void => {
                    if (browser === browserEntry[1]) {
                        browserCleanupPromises.push(browser.quit());
                        this.browserMap.delete(browserEntry[0]);
                    }
                });
            });

            return Promise.all(browserCleanupPromises);
        }

        return Promise.all(
            [...this.browserMap.values()]
                .map((browser): Promise<void> => {
                    return browser.quit();
                })
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((result: any[]): any[] => {
                this.browserMap.clear();
                return result;
            })
    }

    /**
     * startedOn screenshots of all browser created with BrowserWdjs.startedOn
     *
     * @returns - and array of BrowserScreenshotData objects, the object contains the browser name and the screenshot data
     */
    public static takeScreenshots(): Promise<BrowserScreenshotData[]> {
        return Promise.all(
            [...this.browserMap.keys()].map((browsername: string): Promise<BrowserScreenshotData> => {
                return new Promise((resolve, reject): void => {
                    const browser = this.browserMap.get(browsername);
                    if (browser) {
                        browser.takeScreenshot()
                            .then(resolve)
                            .catch(reject)
                    } else {
                        reject(`Browser with name '${browser}' not found`);
                    }
                })
            })
        )
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
        return Promise.all(
            [...this.browserMap.keys()].map((browsername: string): Promise<string> => {
                return new Promise((resolve, reject): void => {
                    const browser = this.browserMap.get(browsername);
                    if (browser) {
                        browser.saveScreenshot(filepath, `${browsername}_${baseFileName}`)
                            .then(resolve)
                            .catch(reject)
                    } else {
                        reject(`Browser with name '${browser}' not found`);
                    }
                })
            })
        )
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
        let getElements = async (): Promise<WebElement[]> => {
            // always switch to the main Window
            // if you want to deal with an element in a frame DO:
            // frame(By.css("locator")).element(By.css("locator"))
            return await this.getDriver()
                .then((driver): promise.Promise<WebElement[]> => {
                    return driver.switchTo().defaultContent()
                        .then((): promise.Promise<WebElement[]> => {
                            return driver.findElements(loc)
                        });
                })
            // return await this._driver.findElements(loc);
        };

        return new WebElementListWdjs(getElements, locator, this);
    }

    public frame(locator: By): FrameElementWdjs {
        const loc = LocatorWdjs.getSelector(locator);

        const createSwitchFrame = (): FrameHelper => {
            return ((conditions: UntilElementCondition[]): Promise<void> => {
                this.logger.debug(`Enter switchFrame of Browser frame method`);
                return new Promise((fulfill, reject): void => {
                    this.logger.debug(`frame base - trying to switch to: ${locator.toString()}`);

                    this.getDriver()
                        .then((driver): void => {

                            const reducer = (acc: Promise<boolean>, condition: UntilElementCondition): Promise<boolean> => {
                                return acc.then((): Promise<boolean> => {
                                    return ExecuteConditionWdjs.execute(condition, driver.findElement(loc))
                                })
                            };

                            // no return of promise as parent Promise will be resolved at the end of chain
                            driver.switchTo().defaultContent()
                                .then((): void                  => this.logger.debug(`frame base - switched to default context`))
                                .then((): Promise<boolean>      => conditions.reduce(reducer, Promise.resolve(true)))
                                .then((): promise.Promise<void> => driver.switchTo().frame(driver.findElement(loc)))
                                .then((): void                  => this.logger.debug(`frame base - switched to: ${loc.toString()}`))
                                .then(fulfill, (): void         => {
                                    this.logger.error(`Error switching base frame`);
                                })
                        })
                        .catch(reject);
                });
            }) as FrameHelper;
        };

        return new FrameElementWdjs(createSwitchFrame(), null, locator, this);
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
            this.getDriver()
                .then((driver): void => {
                    driver.get(_destination)
                        .then(fulfill, reject)
                })
                .catch(reject)
        })
    }

    public getCurrentUrl(): Promise<string> {
        return new Promise((resolve, reject): void => {
            this.getDriver()
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
            if(!this.driverCreated) {
                return fulfill();
            }

            this.getDriver()
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
        return new Promise((fulfill, reject): void => {
            this.getDriver()
                .then((driver): void => {
                    driver.getTitle()
                        .then(fulfill, reject)
                })
                .catch(reject)
        })
    }

    /**
     * checks if the browser has the given title
     * @param expectedTitle
     */
    public hasTitle(expectedTitle: string): Promise<boolean> {
        return new Promise((fulfill, reject): void => {
            this.getDriver()
                .then((driver): void => {
                    driver.getTitle()
                        .then((title): void => fulfill(title === expectedTitle),reject)
                })
                .catch(reject);
        })
    }

    /**
     * returns the browsers screenshot as an base64 encoded png file
     */
    public takeScreenshot(): Promise<BrowserScreenshotData> {
        return new Promise((resolve, reject): void => {
            this.getDriver()
                .then((driver): void => {
                    driver.takeScreenshot()
                        .then((data: string): void => {
                            const screenshotData: BrowserScreenshotData = {
                                browserName: this.browserName,
                                browserScreenshotData: data
                            };
                            return resolve(screenshotData)
                        },reject)
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
                    fs.writeFile(fpn, data.browserScreenshotData, `base64`, (err: any) => {
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
    public wait(
        condition: Condition,
        timeout: number = 5000,
        waitMessage: string = ``): Promise<string> {

        return new Promise((fulfill, reject): void => {
            const start = Date.now();
            const check = (): void => {
                const worker = (workerState: boolean, error?: string) => {
                    const timeSpendWaiting = Date.now() - start;
                    if (timeSpendWaiting > timeout) {
                        const message = `Wait timed out after ${timeout} ms${waitMessage ? ` -> (` + waitMessage + `).` : `.`}`;
                        this.logger.trace(message);
                        reject(message);
                        return;
                    }
                    if (workerState) {
                        const message = `Wait successful ${waitMessage ? ` -> (` + waitMessage + `)` : ``} after ${timeSpendWaiting} ms.`;
                        this.logger.trace(message);
                        fulfill(message);
                        return;
                    } else {
                        setTimeout(check, 0);
                    }
                };

                condition.check()
                    .then(worker)
                    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .catch((e: any) => worker(false, `${e.toString()} \n ${Error().stack}`))
            };
            setTimeout(check, 0);
        })
    }

    public wait2(
        condition: UntilElementCondition,
        element: WebElementFinder): Promise<string> {

        return new Promise((fulfill, reject): void => {
            const start = Date.now();
            const check = (): void => {
                const worker = (workerState: boolean, error?: string) => {
                    const timeSpendWaiting = Date.now() - start;
                    if (timeSpendWaiting > condition.timeout) {
                        const message = `Waiting until element called '${element.description}' ${condition.conditionHelpText} timed out after ${condition.timeout} ms.
                        Stack: ${Error().stack}`;
                        this.logger.trace(message);
                        reject(message);
                        return;
                    }
                    if (workerState) {
                        const message = `Waiting until element called '${element.description}' ${condition.conditionHelpText} was successful after ${timeSpendWaiting} ms.`;
                        this.logger.trace(message);
                        fulfill(message);
                        return;
                    }

                    setTimeout(check, 0);

                };

                ExecuteConditionWdjs.execute(condition, element)
                    .then(worker)

                    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                    .catch((e: any) => worker(false, `${e.toString()} \n ${Error().stack}`)) // eslint-disable-line @typescript-eslint/no-explicit-any
            };
            setTimeout(check, 0);
        })
    }

    //eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public executeScript(func: Function, ...funArgs: any[]): Promise<{}> {
        return new Promise((resolve, reject): void => {
            this.getDriver()
                .then((driver): promise.Promise<{}> => driver.executeScript(func, funArgs))
                .then(resolve, reject)
                .catch(reject)
        });

    }
}