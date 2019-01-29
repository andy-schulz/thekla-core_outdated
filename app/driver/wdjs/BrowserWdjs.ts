import {getLogger, Logger} from "@log4js-node/log4js-api";

import {Options as FFOptions}                from "selenium-webdriver/firefox";
import {Builder, promise, ThenableWebDriver} from "selenium-webdriver";
import {
    BrowserCapabilities,
    FirefoxOptions,
    ProxyConfig,
    SeleniumConfig
}                                            from "../../config/SeleniumConfig";

import {Browser, BrowserScreenshotData}         from "../interface/Browser";
import {BrowserWindow}                          from "../interface/BrowserWindow";
import {By}                                     from "../lib/Locator";
import {WebElementFinder, WebElementListFinder} from "../interface/WebElements";
import {BrowserWindowWdjs}                      from "./BrowserWindowWdjs";
import {FrameElementWdjs}                       from "./FrameElementWdjs";
import {FrameHelper, WdElement}                 from "./interfaces/WdElement";
import {LocatorWdjs}                            from "./LocatorWdjs";
import {WebElementListWdjs}                     from "./WebElementListWdjs";
import {Condition}                              from "../lib/Condition";
import * as path                                from "path";
import * as fs                                  from "fs";
import fsExtra                                  from "fs-extra";


promise.USE_PROMISE_MANAGER = false;

interface CapabilitiesWdjs {
    browserName?: string;
}
export class BrowserWdjs implements Browser{
    private static logger: Logger = getLogger("BrowserWdjsClass");
    private static browserMap: Map<string,Browser> = new Map<string,Browser>();

    private logger: Logger = getLogger("BrowserWdjs");
    private _window: BrowserWindow;

    constructor(
        private _driver: ThenableWebDriver,
        private _selConfig: SeleniumConfig,
        private browserName: string = "") {

        if(typeof this._selConfig.capabilities === "function") {

        } else {

        }
    }

    get driver() {
        return this._driver;
    }

    get config() {
        return this._selConfig;
    }

    get window() {
        return this._window;
    }

    /**
     * create a new browser instance for the given Config
     * @param selConf - the selenium config for which the browser has to be created
     * @param browserName - a unique browser name
     *
     * @returns - browser instance
     * @throws - Error in case the given browser name is empty or already exists
     */
    public static async create(selConf: SeleniumConfig, browserName: string = `browser${this.browserMap.size + 1}`): Promise<Browser> {
        let builder: Builder;

        if (!browserName)
            throw new Error(`invalid browser name '${browserName}'`);

        const regex = /^[a-zA-Z0-9_\-]+$/;
        if(!browserName.match(regex))
            throw new Error(`browser name '${browserName}' contains invalid characters. Allowed characters are: [a-z]*[A-Z]*[_-]*[0-9]*`);

        if(this.browserMap.has(browserName)) {
            throw new Error(`browser name '${browserName}' already exists, choose another one`);
        }

        builder = new Builder();
        try {
            const capa: BrowserCapabilities = typeof selConf.capabilities === "function" ? selConf.capabilities() : selConf.capabilities;

            builder = builder.usingServer(selConf.seleniumServerAddress);
            this.setCapabilities(builder, capa);

            let driver = builder.build();

            const browser = new BrowserWdjs(driver, selConf, browserName);
            try {
                const window = await BrowserWindowWdjs.create(driver, capa.window);
                browser.windowManagedBy(window);
            } catch (e) {
                browser.quit();
                return Promise.reject(e);
            }

            this.browserMap.set(browserName,browser);
            return browser;
        } catch (e) {

            const message = ` ${e} ${Error().stack}`;
            return Promise.reject(e);
        }
    }

    public windowManagedBy(window: BrowserWindow) {
        this._window = window;
    }

    /**
     * set the browsers capabilities
     * @param builder - the builder the capabilities will be set for
     * @param capabilities - the capabilities to be set
     */
    private static  setCapabilities(builder: Builder, capabilities: BrowserCapabilities | undefined) {
        if(!capabilities) return;

        const ca = capabilities;

        const capa: CapabilitiesWdjs = {};

        if(ca.browserName) capa.browserName = ca.browserName;
        this.setProxy(builder, ca.proxy);
        if(ca.firefoxConfig) this.applyFirefoxOptions(builder,ca.firefoxOptions);
        if(ca.chromeConfig) this.applyFirefoxOptions(builder,ca.chromeConfig);


        return builder.withCapabilities(capa);

    }

    /**
     * set the proxy for the browser
     * @param builder - the builder the proxy will be set for
     * @param proxy - the Proxy config which will be set
     */
    private static setProxy = (builder: Builder, proxy: ProxyConfig | undefined): any => {
        if(proxy === undefined) return;

        const proxyWdjs = require("selenium-webdriver/proxy");

        if(proxy.type === "direct") return builder.setProxy(proxyWdjs.direct());
        if(proxy.type === "system") return builder.setProxy(proxyWdjs.system());

        if(proxy.type === "manual") {
            if(!proxy.manualConfig) {
                const message = `You specified 'manual' proxy configuration in the capabilities but did not give a manual proxy config.`;
                BrowserWdjs.logger.info(message);
                throw new Error(message);
            }
            return builder.setProxy(proxyWdjs.manual(proxy.manualConfig))
        }
    };

    /**
     * apply the given firefox options to the builder
     * @param builder - the builder the firefox options will be set for
     * @param options - the firefox options to set
     */
    private static applyFirefoxOptions(builder: Builder, options: FirefoxOptions | undefined): void  {
        if(options) {
            const  firefoxOptions = new FFOptions();
            if(options.binary) {
                firefoxOptions.setBinary(options.binary);
            }

            builder.setFirefoxOptions(firefoxOptions);
        }
    }

    /**
     * close all browser created with BrowserWdjs.create method
     *
     * @returns - resolved Promise after all browsers are closed
     */
    public static cleanup(browserToClean?: Browser[]):Promise<any[]> {

        if(browserToClean) {
            let browserCleanupPromises: Promise<void>[] = [];

            const entries = [...this.browserMap.entries()];
            browserToClean.map((browser: Browser) => {
                entries.map((browserEntry: [string, Browser]) => {
                    if(browser === browserEntry[1]) {
                        browserCleanupPromises.push(browser.quit());
                        this.browserMap.delete(browserEntry[0]);
                    }
                });
            });

            return Promise.all(browserCleanupPromises);
        }

        return Promise.all(
            [...this.browserMap.values()].map((browser) => {
                return browser.quit();
            })
        ).then((result: any[]) => {
            this.browserMap.clear();
            return result;
        })
    }

    /**
     * create screenshots of all browser created with BrowserWdjs.create
     *
     * @returns - and array of BrowserScreenshotData objects, the object contains the browser name and the screenshot data
     */
    public static takeScreenshots(): Promise<BrowserScreenshotData[]> {
        return Promise.all(
            [...this.browserMap.keys()].map((browsername: string): Promise<BrowserScreenshotData> => {
                return new Promise((resolve, reject) => {
                    const browser = this.browserMap.get(browsername);
                    if(browser) {
                        browser.takeScreenshot()
                            .then(resolve)
                            .catch(reject)
                    } else {
                        reject(`Browser with name '${browser}' not found`);
                    }
                })
            })
        )}

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
                return new Promise((resolve, reject) => {
                    const browser = this.browserMap.get(browsername);
                    if(browser) {
                        browser.saveScreenshot(filepath, `${browsername}_${baseFileName}`)
                            .then(resolve)
                            .catch(reject)
                    } else {
                        reject(`Browser with name '${browser}' not found`);
                    }
                })
            })
        )}

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
        if(browser)
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

        return (<WebElementListWdjs>this.all(locator)).toWebElement();
    }

    /**
     * web element array finder
     * @param locator - locator of the web element array finder
     */
    public all(
        locator: By): WebElementListFinder {

        const loc = LocatorWdjs.getSelector(locator);
        let getElements = async () => {
            // always switch to the main Window
            // if you want to deal with an element in a frame DO:
            // frame(By.css("locator")).element(By.css("locator"))
            await this._driver.switchTo().defaultContent();
            return await this._driver.findElements(loc);
        };

        return new WebElementListWdjs(getElements,locator, this);
    }

    frame(locator: By): FrameElementWdjs {
        const loc = LocatorWdjs.getSelector(locator);

        const createSwitchFrame = () => {
            let switchFrame = (() => {
                return new Promise((fulfill, reject) => {
                    this._driver.switchTo().defaultContent()
                        .then(() => this._driver.switchTo().frame(this._driver.findElement(loc)))
                        .then(() => this.logger.debug(`First Level Browser Frame switched.`))
                        .then(fulfill)
                        .catch(e => reject(e));
                });
            }) as FrameHelper;

            switchFrame.element = () => {
                return new Promise((fulfill, reject) => {
                    this._driver.findElement(loc)
                        .then((element: WdElement) => fulfill(element), e => reject(e));
                })
            };
            return switchFrame;
        };

        return new FrameElementWdjs(createSwitchFrame(),locator, this);
    }

    /**
     * load the given address
     * if the url does not start with http*, it will be prefixed with the base url if it exists
     * @param destination
     */
    public get(destination: string): Promise<any> {
        let _destination = this.config.baseUrl && !destination.startsWith("http") ? `${this.config.baseUrl}${destination}` : destination;
        return new Promise((fulfill, reject) => {
            this._driver.get(_destination)
                .then(fulfill)
                .catch(reject)
        })
    }

    /**
     * close the browser
     */
    public quit():Promise<void> {
        return new Promise((fulfill, reject) => {
            this._driver.quit()
                .then(fulfill)
                .catch(reject)
        })
    }

    /**
     * return the browsers title
     */
    public getTitle(): Promise<string> {
        return new Promise((fulfill, reject) => {
            this._driver.getTitle()
                .then(fulfill)
                .catch(reject)
        })
    }

    /**
     * checks if the browser has the given title
     * @param expectedTitle
     */
    public hasTitle(expectedTitle: string): Promise<boolean> {
        return new Promise((fulfill,reject) => {
            this._driver.getTitle()
                .then(title => fulfill(title === expectedTitle))
                .catch(reject);
        })
    }

    /**
     * returns the browsers screenshot as an base64 encoded png file
     */
    public takeScreenshot(): Promise<BrowserScreenshotData> {
        return new Promise((resolve, reject) => {
            this._driver.takeScreenshot()
                .then((data: string) => {
                    const screenshotData: BrowserScreenshotData = {
                        browserName: this.browserName,
                        browserScreenshotData: data
                    };
                    return resolve(screenshotData)
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
        if(!path.isAbsolute(fp)) {
           fp = `${process.cwd()}/${fp}`;
        }

        try {
            if(!fs.existsSync(fp))
                fsExtra.mkdirsSync(fp);
        } catch (e) {
            return Promise.reject(e)
        }


        const fpn = `${fp}/${filename}`;

        return new Promise((resolve, reject) => {
            this.takeScreenshot()
                .then((data: BrowserScreenshotData) => {
                    fs.writeFile(fpn, data.browserScreenshotData, 'base64', (err: any) => {
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
        waitMessage: string = `` ): Promise<string> {

        return new Promise((fulfill,reject) => {
            const start = Date.now();
            const check = () => {
                const worker = (workerState: boolean, error?: String) => {
                    const timeSpendWaiting = Date.now() - start;
                    if(timeSpendWaiting > timeout) {
                        const message = `Wait timed out after ${timeout} ms${waitMessage ? " -> (" + waitMessage + ")." : "."}`;
                        this.logger.trace(message);
                        reject(message);
                        return;
                    }
                    if(workerState) {
                        const message = `Wait successful ${waitMessage ? " -> (" + waitMessage + ")" : ""} after ${timeSpendWaiting} ms.`;
                        this.logger.trace(message);
                        fulfill(message);
                        return;
                    } else {
                        setTimeout(check,0);
                    }
                };

                condition.check()
                    .then(worker)
                    .catch((e: any) => worker(false, e + Error().stack))
            };
            setTimeout(check,0);
        })
    }

    public executeScript(func: Function, ...func_args: any[]): Promise<{}> {
        return new Promise((resolve, reject) => {
            this._driver.executeScript(func, func_args)
                .then(resolve)
                .catch(reject)
        });

    }
}