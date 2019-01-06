import {getLogger, Logger} from "@log4js-node/log4js-api";

import {Options as FFOptions}                from "selenium-webdriver/firefox";
import {Builder, promise, ThenableWebDriver} from "selenium-webdriver";

import {Browser}                                from "../interface/Browser";
import {Config, FirefoxOptions}                 from "../interface/Config";
import {By}                                     from "../lib/Locator";
import {WebElementFinder, WebElementListFinder} from "../interface/WebElements";
import {FrameElementWdjs}                       from "./FrameElementWdjs";
import {FrameHelper, WdElement}                 from "./interfaces/WdElement";
import {LocatorWdjs}                            from "./LocatorWdjs";
import {WebElementListWdjs}                     from "./WebElementListWdjs";
import {Condition}                              from "../lib/Condition";

promise.USE_PROMISE_MANAGER = false;

export class BrowserWdjs implements Browser{

    private logger: Logger = getLogger("BrowserWdjs");
    private static browserMap: Map<string,Browser> = new Map<string,Browser>();

    constructor(
        private _driver: ThenableWebDriver,
        private _config: Config) {
    }

    get driver() {
        return this._driver;
    }

    get config() {
        return this._config;
    }



    public static create(config: Config): Browser {
        let builder: Builder;
        // return new Promise(async (fulfill, reject) => {
            try {
                builder = new Builder().
                usingServer(config.serverUrl).
                withCapabilities(config);

                this.applyFirefoxOptions(builder,config.firefoxOptions);

                let driver = builder.build();
                let browser = new BrowserWdjs(driver, config);
                this.browserMap.set(`browser${this.browserMap.size + 1}`,browser);
                return browser;
                // fulfill(driver);
            } catch (e) {
                const message = ` ${e} ${Error().stack}`;
                throw new Error(message)
                // return reject(message)
            }

        // })
    }

    private static applyFirefoxOptions(builder: Builder, options: FirefoxOptions | undefined): void  {
        if(options) {
            const  firefoxOptions = new FFOptions();
            if(options.binary) {
                firefoxOptions.setBinary(options.binary);
            }

            if(options.proxy) {
                builder.setProxy(options.proxy)
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