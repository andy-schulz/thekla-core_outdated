import {WebDriver}          from "selenium-webdriver";
import {ClientCtrls}        from "../interface/ClientCtrls";
import {TkWebElement}       from "../interface/TkWebElement";
import {BrowserWdjs}        from "./BrowserWdjs";
import {WebElementListWdjs} from "./WebElementListWdjs";
import {WebElementWd}       from "../lib/element/WebElementWd";
import {Annotator}          from "webdriverjs_annotator";

export class WebElementWdjs extends WebElementWd<WebDriver> {
    private _browser: BrowserWdjs;

    public constructor(
        elementList: WebElementListWdjs,
        browser: ClientCtrls<WebDriver>) {
        super(elementList,browser);
        this._browser = browser as BrowserWdjs;
    }

    public static readonly create = (elementList: WebElementListWdjs,
        browser: ClientCtrls<WebDriver>): WebElementWdjs => {
        return new WebElementWdjs(elementList, browser)
    };

    protected  getWebElement = async (): Promise<TkWebElement> => {
        const displayMessage = this._browser.displayTestMessages;

        if (displayMessage) {
            const message = `Trying to find ${this.toString()}`;
            await Annotator.displayTestMessage(await this._browser.getFrameWorkClient(), message);
        }

        return this.parentGetWebElement().then(async (element: TkWebElement) => {
            const annotate = async (annotateElement: boolean, element: TkWebElement, driver: WebDriver) => {
                if (annotateElement)
                    await Annotator.highlight(driver, element.getFrWkElement());
            };

            if (displayMessage)
                await Annotator.hideTestMessage(await this._browser.getFrameWorkClient());

            await annotate(this._browser.annotateElement === true, element, await this._browser.getFrameWorkClient());

            return element
        });
    }
}