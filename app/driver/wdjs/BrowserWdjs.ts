import {getLogger, Logger} from "@log4js-node/log4js-api";

import {Options as FFOptions}                                                   from "selenium-webdriver/firefox";
import {Builder, Capabilities, promise, ThenableWebDriver}                      from "selenium-webdriver";
import {
    BrowserCapabilities,
    CapabilitiesFunction,
    FirefoxOptions,
    ProxyConfig,
    SeleniumConfig
} from "../../config/SeleniumConfig";

import {Browser}                                                          from "../interface/Browser";
import {By}                                                               from "../lib/Locator";
import {WebElementFinder, WebElementListFinder}                           from "../interface/WebElements";
import {FrameElementWdjs}                                                 from "./FrameElementWdjs";
import {FrameHelper, WdElement}                                           from "./interfaces/WdElement";
import {LocatorWdjs}                                                      from "./LocatorWdjs";
import {WebElementListWdjs}                                               from "./WebElementListWdjs";
import {Condition}                                     from "../lib/Condition";

promise.USE_PROMISE_MANAGER = false;

interface CapabilitiesWdjs {
    browserName?: string;
}

export class BrowserWdjs implements Browser{

    private logger: Logger = getLogger("BrowserWdjs");
    private static logger: Logger = getLogger("BrowserWdjsClass");

    private static browserMap: Map<string,Browser> = new Map<string,Browser>();

    constructor(
        private _driver: ThenableWebDriver,
        private _selConfig: SeleniumConfig) {
    }

    get driver() {
        return this._driver;
    }

    get config() {
        return this._selConfig;
    }


    public static create(selConf: SeleniumConfig): Browser {
        let builder: Builder;

        builder = new Builder()
        try {
            builder = builder.usingServer(selConf.seleniumServerAddress);
            this.setCapabilities(builder, selConf.capabilities);

            let driver = builder.build();

            let browser = new BrowserWdjs(driver, selConf);
            this.browserMap.set(`browser${this.browserMap.size + 1}`,browser);
            return browser;
        } catch (e) {
            const message = ` ${e} ${Error().stack}`;
            throw new Error(message)
        }
    }

    private static  setCapabilities(builder: Builder, capabilities: BrowserCapabilities | CapabilitiesFunction | undefined) {
        if(!capabilities) return;

        const ca = <BrowserCapabilities>capabilities;

        const capa: CapabilitiesWdjs = {};

        if(ca.browserName) capa.browserName = ca.browserName;
        this.setProxy(builder, ca.proxy);
        if(ca.firefoxConfig) this.applyFirefoxOptions(builder,ca.firefoxOptions);
        if(ca.chromeConfig) this.applyFirefoxOptions(builder,ca.chromeConfig);


        return builder.withCapabilities(capa);

    }

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

    private static applyFirefoxOptions(builder: Builder, options: FirefoxOptions | undefined): void  {
        if(options) {
            const  firefoxOptions = new FFOptions();
            if(options.binary) {
                firefoxOptions.setBinary(options.binary);
            }

            builder.setFirefoxOptions(firefoxOptions);
        }
    }

    public static cleanup():Promise<any[]> {
        return Promise.all(
            [...this.browserMap.values()].map((browser) => {
                return browser.quit();
            })
        ).then((result: any[]) => {
            this.browserMap.clear();
            return result;
        })
    }


    public element(
        locator: By): WebElementFinder {

        return (<WebElementListWdjs>this.all(locator)).toWebElement();
    }

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

    public get(destination: string): Promise<any> {
        let _destination = this.config.baseUrl && !destination.startsWith("http") ? `${this.config.baseUrl}${destination}` : destination;
        return new Promise((fulfill, reject) => {
            this._driver.get(_destination)
                .then(fulfill)
                .catch(reject)
        })
    }

    public quit():Promise<void> {
        return new Promise((fulfill, reject) => {
            this._driver.quit()
                .then(fulfill)
                .catch(reject)
        })
    }

    public getTitle(): Promise<string> {
        return new Promise((fulfill, reject) => {
            this._driver.getTitle()
                .then(fulfill)
                .catch(reject)
        })
    }

    public hasTitle(expectedTitle: string): Promise<boolean> {
        return new Promise((fulfill,reject) => {
            this._driver.getTitle()
                .then(title => fulfill(title === expectedTitle))
                .catch(reject);
        })
    }

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
                        const message = `Wait successful${waitMessage ? " -> (" + waitMessage + ")" : ""} after ${timeSpendWaiting} ms.`;
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
}