import {getLogger, Logger}            from "@log4js-node/log4js-api";
import {WebDriver}                    from "selenium-webdriver";
import {ClientCtrls}                  from "../interface/ClientCtrls";
import {TkWebElement}                 from "../interface/TkWebElement";
import {FrameCreator, FrameElementWd} from "../lib/element/FrameElementWd";
import {By}                           from "../lib/element/Locator";
import {LocatorWdjs}                  from "./LocatorWdjs";
import {WebElementJS}                 from "./wrapper/WebElementJS";


export class FrameElementWdjs extends FrameElementWd<WebDriver> {
    protected logger: Logger = getLogger(`FrameElementWdjs`);
    public constructor(
        private _getFrames: () => Promise<TkWebElement[]>,
        private __locator: By,
        private _browser: ClientCtrls<WebDriver>,
        private _createFrameElement: FrameCreator<WebDriver>) {
        super(_getFrames, __locator, _browser, _createFrameElement);
    }

    public static create = (
        _getFrames: () => Promise<TkWebElement[]>,
        __locator: By,
        _browser: ClientCtrls<WebDriver>
    ): FrameElementWdjs => {
        return new FrameElementWdjs(_getFrames, __locator, _browser, FrameElementWdjs.create)
    };

    protected findElementsDriver(locator: By): Promise<WebElementJS[]> {
        const loc = LocatorWdjs.getSelector(locator);

        return this._browser.getFrameWorkClient()
            .then((driver: WebDriver) => {
                return driver.findElements(loc)
                    .then((elements) => {
                        this.logger.trace(`Found ${elements.length} chained frame(s) with locator ${this.__locator.toString()}`);
                        return WebElementJS.createAll(elements, driver);
                    })
            })
    }


    protected switchFrameDriver(driver: WebDriver, element: any): Promise<void> {
        return new Promise((resolve, reject) => {
            driver.switchTo().frame(element).then(() => {
                resolve();
            }, reject)
        })
    }



}