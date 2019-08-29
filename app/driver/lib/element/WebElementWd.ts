import * as _                                   from "lodash";
import {Client}                                 from "webdriver";
import {DidNotFind}                             from "../../errors/DidNotFind";
import {ClientCtrls}                            from "../../interface/ClientCtrls";
import {TkWebElement}                           from "../../interface/TkWebElement";
import {WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {AnnotatorWdio}                          from "../AnnotatorWdio";
import {UntilElementCondition}                  from "./ElementConditions";
import {ElementLocationInView}                  from "./ElementLocation";
import {WebElementListWd}                       from "./WebElementListWd";
import {By}                                     from "../../../index";
import {getLogger, Logger}                      from "log4js";
import fp, {identity}                           from "lodash/fp"

export class WebElementWd<WD> implements WebElementFinder {
    private _description: string = ``;
    private logger: Logger = getLogger(`WebElementWd`);

    public constructor(
        private elementList: WebElementListWd<WD>,
        private browser: ClientCtrls<WD>) {
    }

    public all(locator: By): WebElementListFinder {
        return this.elementList.all(locator);
    };

    public element(locator: By): WebElementFinder {
        return this.elementList.element(locator);
    };

    private annotateElement = _.curry((shallAnnotateElement: boolean | undefined, client: Client): (element: TkWebElement) => Promise<TkWebElement> => {
        return shallAnnotateElement ?
            AnnotatorWdio.highlight(client) :
            (element) => Promise.resolve(element)
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

    protected getWebElement = (): Promise<TkWebElement> => {

        const head = (elements: TkWebElement[]): () => Promise<TkWebElement> => {
            return () => {
                if (elements.length === 0) return Promise.reject(DidNotFind.theElement(this));
                if (elements.length > 1) {
                    this.logger.trace(`Found ${elements ? elements.length : 0} element(s) for ${this.elementList.locatorDescription}`)
                }
                return Promise.resolve(elements[0])
            }
        };

        return this.browser.getFrameWorkClient()
            .then((client: WD): Promise<TkWebElement> => {
                const clnt = client as unknown as Client;
                const elements: TkWebElement[] = [];

                return this.displayTestMessage(this.browser.serverConfig.displayTestMessages)
                (`Trying to find ${this.toString()}`)
                (clnt)
                    .then((): Promise<TkWebElement[]> => this.elementList.getElements())
                    .then((elems: TkWebElement[]) =>  { elements.push(...elems); return clnt; })
                    .then(this.hideTestMessage(this.browser.serverConfig.displayTestMessages))
                    .then(head(elements))
                    .then(this.annotateElement(this.browser.serverConfig.annotateElement)(clnt))
                    .then(() => elements[0])
            });
    };

    protected parentGetWebElement = this.getWebElement;

    public click(): Promise<void> {
        return this.getWebElement().then((element: any): Promise<void> => element.click())
    }

    public movePointerTo  = (pr?: Promise<void>): Promise<void> => {
        return (pr ? pr : Promise.resolve())
            .then(() => {
                return this.getWebElement()
            })
            .then((element: TkWebElement): Promise<void> => {
                return element.move();
            })
    };

    public dragToElement(element: WebElementFinder): Promise<void> {
        return fp.flow(
            this.movePointerTo,
            this.browser.pointerButtonDown(0),
            element.movePointerTo,
            this.browser.pointerButtonUp(0),
            this.browser.releaseActions
        )()
    }

    public hover(): Promise<void> {
        return this.movePointerTo();
    }

    public sendKeys(keySequence: string): Promise<void> {
        return this.getWebElement()
            .then((element: any): Promise<void> => element.sendKeys(keySequence))
    }

    public getText(): Promise<string> {
        return this.getWebElement()
            .then((element: any): Promise<string> => element.getText())
            .then((text): string => text)
    }

    public getAttribute(attributeName: string): Promise<string> {
        return this.getWebElement()
            .then(async (element: TkWebElement): Promise<string> =>  {
                return element.getAttribute(attributeName);
            })
            .then((text): string => text);
    }

    public getProperty(propertyName: string): Promise<string> {
        return this.getWebElement()
            .then((element: TkWebElement): Promise<string> => {
                return element.getProperty(propertyName);
            })
    }

    public getRect(): Promise<object> {
        return this.getWebElement()
            .then((element: TkWebElement): Promise<object> => {
                return element.getRect();
            })
    }

    private getElementLocationInViewFromElement = (pr: Promise<TkWebElement>): Promise<ElementLocationInView> => {
        return pr.then((element: TkWebElement): Promise<ElementLocationInView> => {
            return element.getLocationInView()
        })
    };

    public getElementLocationInView(): Promise<ElementLocationInView> {
        return fp.flow(
            this.getWebElement,
            this.getElementLocationInViewFromElement
        )();
    }

    public isVisible(): Promise<boolean> {
        return this.isDisplayed()
    }

    public isDisplayed(): Promise<boolean> {
        return this.getWebElement()
            .then((element: any): TkWebElement => {
                this.logger.trace(`${element ? `Did find ` : `Did not find`} the elements to check for display state`);
                return element;
            })
            .then((element: any): Promise<boolean> => element[`isDisplayed`]())
            .then((state): boolean => state) // returns a Promise and not the webdriver promise.Promise
            .catch((): boolean => false)
    }

    public isEnabled(): Promise<boolean> {
        return this.getWebElement()
            .then((element: any): Promise<boolean> => element[`isEnabled`]())
            .then((state): boolean => state)
            .catch((): boolean => false)
    }

    public scrollIntoView(): Promise<void> {
        return this.getWebElement()
            .then((element): Promise<void> => {
                return element.scrollIntoView();
            })
    }

    public clear(): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.getWebElement()
                .then((element: any): Promise<void> => element.clear())
                .then(resolve, reject)
                .catch(reject)
        })
    }

    public get description(): string {
        return `${this.elementList.description}${this._description}`;
    }

    public called(description: string): WebElementFinder {
        this.logger.debug(`Set Description to '${description}'`);
        this.elementList.called(description);
        return this;
    }

    public toString(): string {
        return `'${this.elementList.description ? this.elementList.description : `Element`}' selected by: >>${this.elementList.locatorDescription}<<`;
    }

    public shallWait(condition: UntilElementCondition): WebElementFinder {
        return (this.elementList.shallWait(condition) as WebElementListWd<WD>).toWebElement() as WebElementFinder;
    }
}