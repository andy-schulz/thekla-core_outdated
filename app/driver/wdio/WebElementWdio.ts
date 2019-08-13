import {ClientCtrls}        from "../interface/ClientCtrls";
import {TkWebElement}       from "../interface/TkWebElement";
import {WebElementWd}       from "../lib/element/WebElementWd";
import {ClientWdio}         from "./ClientWdio";
import {Client}             from "webdriver";
import {WebElementListWdio} from "./WebElementListWdio";

export class WebElementWdio extends WebElementWd<Client> {
    private _browser: ClientWdio;

    public constructor(
        elementList: WebElementListWdio,
        browser: ClientCtrls<Client>) {

        super(elementList,browser);
        this._browser = browser as ClientWdio;
    }

    public static readonly create = (elementList: WebElementListWdio,
        browser: ClientCtrls<Client>): WebElementWdio => {
        return new  WebElementWdio(elementList, browser)
    };

    protected getWebElement = async (): Promise<TkWebElement> => {
        return this.parentGetWebElement();
        // TODO: implement Annotator for WebdriverIO
    };

    public getAttribute(attributeName: string): Promise<string> {
        return super.getAttribute(attributeName)
            .then((attributeValue: string): Promise<string> => {
                if(!attributeValue)
                    return this.getProperty(attributeName);
                return Promise.resolve(attributeValue);
            })
    }
}