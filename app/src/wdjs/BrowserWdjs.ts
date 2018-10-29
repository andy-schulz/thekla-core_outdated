import {Browser} from "../../interface/Browser";
import {WebElement} from "../../interface/WebElement";
import {WebElementWdjs} from "./WebElementWdjs";
import {LocatorWdjs} from "./LocatorWdjs";
import {Config} from "../../interface/Config";

import {Builder, By, until, Key, ThenableWebDriver} from "selenium-webdriver";

import {configure, getLogger, Logger} from "log4js";
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

    element(locator: LocatorWdjs): WebElement{
        return new WebElementWdjs(this);
    }

    get(destination: string): Promise<any> {
        return new Promise((fullfill, reject) => {
            this.driver.get(destination).then((res: any) => {
                fullfill(res);
            }).catch((e) => {
                reject(e)
            })
        })
    }

    quit():Promise<void> {
        return new Promise((fulfill, reject) => {
            this.driver.quit().then(() => {
                fulfill();
            })
        })
    }

    element(): WebElement {
        return new ElementArrayFinder(this).all(locator).toElementFinder_();
    }

    let element = ((locator: Locator) => {

    }) as ElementHelper;

    element.all = (locator: Locator) => {
        return new ElementArrayFinder(browser).all(locator);
    };

    return element;
}