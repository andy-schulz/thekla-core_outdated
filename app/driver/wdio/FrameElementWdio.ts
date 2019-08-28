import {getLogger, Logger}            from "@log4js-node/log4js-api";
import {ClientCtrls}                  from "../interface/ClientCtrls";
import {TkWebElement}                 from "../interface/TkWebElement";
import {FrameCreator, FrameElementWd} from "../lib/element/FrameElementWd";
import {By}                           from "../lib/element/Locator";
import {LocatorWdio}                  from "./LocatorWdio";
import {ElementRefIO, WebElementIO}   from "./wrapper/WebElementIO";
import Client = WebDriver.Client;

export class FrameElementWdio extends FrameElementWd<Client> {
    protected logger: Logger = getLogger(`FrameElementWdjs`);
    public constructor(
        private _getFrames: () => Promise<TkWebElement[]>,
        private __locator: By,
        private _browser: ClientCtrls<Client>,
        private _createFrameElement: FrameCreator<Client>) {
        super(_getFrames, __locator, _browser, _createFrameElement);
    }

    public static create = (
        _getFrames: () => Promise<TkWebElement[]>,
        __locator: By,
        _browser: ClientCtrls<Client>
    ): FrameElementWdio => {
        return new FrameElementWdio(_getFrames, __locator, _browser, FrameElementWdio.create)
    };

    protected findElementsDriver(locator: By): Promise<TkWebElement[]> {
        return this._browser.getFrameWorkClient()
            .then(LocatorWdio.retrieveElements(locator))
    }

    protected switchFrameDriver(driver: Client, element: ElementRefIO): Promise<void> {
        return new Promise((resolve, reject) => {
            (driver.switchToFrame(element) as unknown as Promise<void>)
                .then(() => {
                    resolve();
                }, reject)
        })
    }
}