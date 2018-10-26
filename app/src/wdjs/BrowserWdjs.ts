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

                fulfill(new BrowserWdjs(driver));
            } catch (e) {
                const message = ` ${e} ${Error().stack}`;
                return reject(message)
            }

        })
    }

    element(locator: LocatorWdjs): WebElement{
        return new WebElementWdjs(this);
    }

    get() {
        return this.driver.get(destination)
    }
}