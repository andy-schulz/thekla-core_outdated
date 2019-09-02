import * as _               from "lodash";
import {ClientCtrls}        from "../interface/ClientCtrls";
import {TkWebElement}       from "../interface/TkWebElement";
import {AnnotatorWdio}      from "../../packages/annotator/AnnotatorWdio";
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

    private annotateElement = _.curry((shallAnnotateElement: boolean | undefined, element: TkWebElement<Client>): (client: Client) => Promise<TkWebElement<Client>> => {
        return shallAnnotateElement ?
            AnnotatorWdio.highlight(element) :
            (client) => Promise.resolve(element)
    });

    private displayTestMessage = _.curry((shallPrintTestMessage: boolean | undefined, testMessage: string): (client: Client) => Promise<Client> => {
        return shallPrintTestMessage ?
            AnnotatorWdio.displayTestMessage(testMessage) :
            (client) => Promise.resolve(client)
    });

    private hideTestMessage = (shallPrintTestMessage: boolean | undefined): (client: Client) => Promise<Client> => {
        return shallPrintTestMessage ?
            AnnotatorWdio.hideTestMessage :
            (client) => Promise.resolve(client)
    };

    public static readonly create = (elementList: WebElementListWdio,
        browser: ClientCtrls<Client>): WebElementWdio => {
        return new  WebElementWdio(elementList, browser)
    };

    protected getWebElement = async (): Promise<TkWebElement<Client>> => {
        // return this.parentGetWebElement();
        // TODO: implement Annotator for WebdriverIO

        return this._browser.getFrameWorkClient()
            .then((client: Client): Promise<TkWebElement<Client>> => {
                const clnt = client as unknown as Client;
                const element: TkWebElement<Client>[] = [];

                return this.displayTestMessage(this._browser.serverConfig.displayTestMessages)
                (`Trying to find ${this.toString()}`)
                (clnt)
                    .then((): Promise<TkWebElement<Client>> => this.parentGetWebElement())
                    .then((elem: TkWebElement<Client>) => {element.push(elem); return clnt;})
                    .then(this.hideTestMessage(this._browser.serverConfig.displayTestMessages))
                    .then((client: Client) => {
                        return this.annotateElement(this._browser.serverConfig.annotateElement)(element[0])(client)
                    })
                    .then(() => element[0])
            });
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