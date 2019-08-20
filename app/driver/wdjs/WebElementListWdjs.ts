import {WebDriver}        from "selenium-webdriver";
import {ClientCtrls}      from "../interface/ClientCtrls";
import {By}               from "../lib/element/Locator";
import {BrowserWdjs}      from "./BrowserWdjs";
import {WebElementJS}     from "./wrapper/WebElementJS";
import {WebElementListWd} from "../lib/element/WebElementListWd";
import {WebElementWdjs}   from "./WebElementWdjs";

export class WebElementListWdjs extends WebElementListWd<WebDriver> {
    public constructor(
        getElements: () => Promise<WebElementJS[]>,
        _locator: By,
        browser: BrowserWdjs,
        createWebElementFromList: (elementList: WebElementListWdjs,
            browser: ClientCtrls<WebDriver>) => WebElementWdjs) {
        super(getElements, _locator, browser, createWebElementFromList)
    }
}