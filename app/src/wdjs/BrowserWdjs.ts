import {Browser} from "../../interface/Browser";
import {Config} from "../../interface/Config";

import {Builder, By, until, Key, ThenableWebDriver} from "selenium-webdriver";

import {configure, getLogger, Logger} from "log4js";
import {Locator} from "../../interface/Locator";
import {WdElement, WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {WebElementWdjs} from "./WebElementWdjs";
import {WebElementListWdjs} from "./WebElementListWdjs";

configure('config/log4js.json');

export class BrowserWdjs implements Browser{
    private driver: ThenableWebDriver;
    private logger: Logger = getLogger("BrowserWdjs");
    private static bowserMap: Map<string,Browser> = new Map<string,Browser>();

    constructor(browser: ThenableWebDriver) {
        this.driver = browser;
    }

    public static create(config: Config): Promise<Browser> {
        return new Promise((fulfill, reject) => {
            try {
                let driver = new Builder().
                usingServer(config.serverUrl).
                withCapabilities(config).
                build();

                let browser = new BrowserWdjs(driver);
                this.bowserMap.set(`browser${this.bowserMap.size + 1}`,browser);
                fulfill(browser);
            } catch (e) {
                const message = ` ${e} ${Error().stack}`;
                return reject(message)
            }

        })
    }

    public static cleanup():Promise<any[]> {
        return Promise.all(
            [...this.bowserMap.values()].map((browser) => {
                return browser.quit()
            })
        )
    }

    public get(destination: string): Promise<any> {
        return new Promise((fullfill, reject) => {
            this.driver.get(destination).then((res: any) => {
                fullfill(res);
            }).catch((e) => {
                reject(e)
            })
        })
    }

    public quit():Promise<void> {
        return new Promise((fulfill, reject) => {
            this.driver.quit().then(() => {
                fulfill();
            })
        })
    }



    public element(locator: Locator): WebElementFinder {
        return (<WebElementListWdjs>this.all(locator)).toWebElement();
    }

    public all(locator: Locator): WebElementListFinder {
        // wrap it in WebElems
        let getElements = () => {
            return this.findElements(locator)
        };

        // should return a single element
        return new WebElementListWdjs(getElements);
    }

    private findElements(locator: Locator): Promise<WdElement[]> {
        return new Promise(async (fulfill, reject) => {
            let elements = await this.driver.findElements(locator);
            fulfill(elements);
        })
    }
}