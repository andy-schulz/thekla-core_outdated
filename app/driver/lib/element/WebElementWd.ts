import {DidNotFind}                             from "../../errors/DidNotFind";
import {ClientCtrls}                            from "../../interface/ClientCtrls";
import {TkWebElement}                           from "../../interface/TkWebElement";
import {WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {UntilElementCondition}                  from "./ElementConditions";
import {ElementLocationInView}                  from "./ElementLocation";
import {WebElementListWd}                       from "./WebElementListWd";
import {By}                                     from "../../../index";
import {getLogger, Logger}                      from "log4js";
import fp                                       from "lodash/fp"


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

    protected getWebElement = (): Promise<TkWebElement> => {
        return new Promise(async (resolve, reject): Promise<void> => {


            const elements = await this.elementList.getElements()
                .catch((e): void => {
                    reject(e);
                });

            this.logger.trace(`Found ${elements ? elements.length : 0} element(s) for ${this.elementList.locatorDescription}`);

            // if getElements is rejected just leave the function
            if (!elements) {
                return;
            }

            if (elements.length === 0) {
                // const message = `Element not found: ${this.toString()}`;

                // throw DidNotFind.theElement(this);

                reject(DidNotFind.theElement(this));
                // return;
            } else if (elements.length >= 2) {
                const message = `More than one Element found of: ${this.toString()}. I am going to select the first one.`;
                this.logger.warn(message);
            }
            resolve(elements[0])
        })
    };

    protected parentGetWebElement = this.getWebElement;

    public click(): Promise<void> {
        return this.getWebElement().then((element: any): Promise<void> => element.click())
    }

    public hover(): Promise<void> {
        return this.getWebElement()
            .then((element: TkWebElement): Promise<void> => {
                return element.move();
            })
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
        return this.getWebElement().then((element): Promise<void> => {
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