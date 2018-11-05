import {Browser} from "../../interface/Browser";
import {Config, FirefoxOptions} from "../../interface/Config";

import {Builder, until, Key, ThenableWebDriver} from "selenium-webdriver";

import {configure, getLogger, Logger} from "log4js";
import {Selector, By} from "../../interface/Locator";
import {WdElement, WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {WebElementListWdjs} from "./WebElementListWdjs";

import {Options as FFOptions} from "selenium-webdriver/firefox";

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
                builder.setFirefoxOptions(firefoxOptions);
            }
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
            const desc = `'${description}' selected by: >>${locator.toString()}<<`;
            return desc;
        };

        // should return a single element
        return new WebElementListWdjs(getElements, getDescription);
    }
}