import {ClientCtrls}      from "../interface/ClientCtrls";
import {TkWebElement}     from "../interface/TkWebElement";
import {By}               from "../lib/element/Locator";
import {WebElementListWd} from "../lib/element/WebElementListWd";
import {ClientWdio}       from "./ClientWdio";
import { Client }         from "webdriver";
import { WebElementWdio } from "./WebElementWdio";

export class WebElementListWdio extends WebElementListWd<Client> {
    public constructor(
        getElements: () => Promise<TkWebElement<Client>[]>,
        _locator: By,
        browser: ClientWdio,
        createWebElementFromList: (elementList: WebElementListWdio,
            browser: ClientCtrls<Client>) => WebElementWdio = WebElementWdio.create) {
        super(getElements,_locator,browser,createWebElementFromList)
    }
}