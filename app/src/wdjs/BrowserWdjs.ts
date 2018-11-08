import {Browser} from "../../interface/Browser";
import {Config, FirefoxOptions} from "../../interface/Config";

import {Builder, ThenableWebDriver} from "selenium-webdriver";

import {configure, getLogger, Logger} from "log4js";
import {By} from "../lib/Locator";
import { WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {WebElementListWdjs} from "./WebElementListWdjs";

import {Options as FFOptions} from "selenium-webdriver/firefox";
import {Condition} from "../lib/Condition";



configure('config/log4js.json');

export class BrowserWdjs implements Browser{
    private driver: ThenableWebDriver;

    private logger: Logger = getLogger("BrowserWdjs");
    private static bowserMap: Map<string,Browser> = new Map<string,Browser>();

    constructor(browser: ThenableWebDriver) {
        this.driver = browser;
    }

    public static create(config: Config): Promise<Browser> {
        let builder: Builder;
        return new Promise(async (fulfill, reject) => {
            try {
                builder = new Builder().
                usingServer(config.serverUrl).
                withCapabilities(config);

                this.applyFirefoxOptions(builder,config.firefoxOptions);

                let driver = builder.build();
                let browser = new BrowserWdjs(driver);
                this.bowserMap.set(`browser${this.bowserMap.size + 1}`,browser);
                fulfill(browser);
            } catch (e) {
                const message = ` ${e} ${Error().stack}`;
                return reject(message)
            }

        })
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
            [...this.bowserMap.values()].map((browser) => {
                return browser.quit()
            })
        )
    }

    public get(destination: string): Promise<any> {
        return new Promise((fulfill, reject) => {
            this.driver.get(destination)
                .then(fulfill)
                .catch(reject)
        })
    }

    public quit():Promise<void> {
        return new Promise((fulfill, reject) => {
            this.driver.quit()
                .then(fulfill)
                .catch(reject)
        })
    }

    public getTitle(): Promise<string> {
        return new Promise((fulfill, reject) => {
            this.driver.getTitle()
                .then(fulfill)
                .catch(reject)
        })
    }

    public hasTitle(expectedTitle: string): Promise<boolean> {
        return new Promise((fulfill,reject) => {
            this.driver.getTitle()
                .then(title => title === expectedTitle)
                .catch(reject);
        })
    }

    public wait(
        condition: Condition,
        timeout: number = 5000,
        waitMessage: string = `` ): Promise<string> {
        const timeoutMessage = `Wait timed out after ${timeout} ms${waitMessage ? " -> (" + waitMessage + ")." : "."}`;

        return new Promise((fulfill,reject) => {
            const start = Date.now();
            const check = () => {

                const worker = (workerState: boolean, error?: String) => {
                    const timeSpendWaiting = Date.now() - start;
                    if(timeSpendWaiting > timeout) {
                        const message = error ? error : timeoutMessage;
                        this.logger.error(`Waiting${waitMessage ? " -> (" + waitMessage + ")" : ""} failed after ${timeSpendWaiting} ms with the following Error: ${message}`);
                        reject(message);
                        return;
                    }
                    if(workerState) {
                        const message = `Wait successful${waitMessage ? " -> (" + waitMessage + ")" : ""} after ${timeSpendWaiting} ms.`;
                        this.logger.info(message);
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



    public element(
        locator: By,
        description: string = `Element without description`): WebElementFinder {
        return (<WebElementListWdjs>this.all(locator,description)).toWebElement();
    }

    public all(
        locator: By,
        description: string = `Element without description`): WebElementListFinder {
        // wrap it in WebElems
        const loc = locator.getSelector("wdjs");
        let getElements = async () => {
            return await this.driver.findElements(loc);
        };

        let getDescription = () => {
            return `'${description}' selected by: >>${locator.toString()}<<`;
        };

        // should return a single element
        return new WebElementListWdjs(getElements, getDescription);
    }
}