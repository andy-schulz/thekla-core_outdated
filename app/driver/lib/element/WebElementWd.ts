import {DidNotFind}                                                      from "../../errors/DidNotFind";
import {ClientCtrls}                                                     from "../../interface/ClientCtrls";
import {TkWebElement}                                                    from "../../interface/TkWebElement";
import {WebElementFinder, WebElementListFinder}                          from "../../interface/WebElements";
import {UntilElementCondition}                                           from "./ElementConditions";
import {centerDistance, ElementDimensions, ElementLocationInView, Point} from "./ElementLocation";
import {WebElementListWd}                                                from "./WebElementListWd";
import {By}                                                              from "../../..";
import {getLogger, Logger}                                               from "log4js";
import fp                                                                from "lodash/fp"

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

    protected getWebElement = (): Promise<TkWebElement<WD>> => {

        const head = (elements: TkWebElement<WD>[]): Promise<TkWebElement<WD>> => {
            if (elements.length === 0) return Promise.reject(DidNotFind.theElement(this));
            if (elements.length > 1) {
                this.logger.trace(`Found ${elements ? elements.length : 0} element(s) for ${this.elementList.locatorDescription}`)
            }
            return Promise.resolve(elements[0])
        };

        return this.elementList.getElements()
            .then(head)
    };

    protected parentGetWebElement = this.getWebElement;

    public click(): Promise<void> {
        return this.getWebElement().then((element: any): Promise<void> => element.click())
    }

    public movePointerTo = (client: WD): Promise<WD> => {
        return this.getWebElement()
            .then((element: TkWebElement<WD>): Promise<WD> => {
                return element.move()(client);
            })
            .then(() => client)
    };

    public dragToElement(element: WebElementFinder): Promise<void> {

        return this.getCenterDistanceTo(element)
            .then((distance: Point): Promise<void> => {
                return (this.browser.getFrameWorkClient())
                    .then(this.movePointerTo)
                    .then(this.browser.pointerButtonDown(0))
                    // this is a workaround for chrome, firefox works great but chrome does not
                    // it seems chrome swallows the first move action
                    .then(this.browser.movePointerTo({x: 5, y: 5}))
                    .then(this.browser.movePointerTo({x: distance.x, y: distance.y}))
                    .then(this.browser.pointerButtonUp(0))
                    .then((): void => {})
            });
    }

    private getCenterDistanceTo(element: WebElementFinder): Promise<Point>{

        const calculate = ([p1, p2]: Point[]): Point => {
            return centerDistance(p1,p2)
        };

        return Promise.all([this.getCenterPoint(), element.getCenterPoint()])
            .then(calculate)
    }

    public hover(): Promise<void> {
        return this.browser.getFrameWorkClient()
            .then(this.movePointerTo)
            .then(() => {
            });
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
            .then(async (element: TkWebElement<WD>): Promise<string> => {
                return element.getAttribute(attributeName);
            })
            .then((text): string => text);
    }

    public getProperty(propertyName: string): Promise<string> {
        return this.getWebElement()
            .then((element: TkWebElement<WD>): Promise<string> => {
                return element.getProperty(propertyName);
            })
    }

    public getRect(): Promise<ElementDimensions> {
        return this.getWebElement()
            .then((element: TkWebElement<WD>): Promise<ElementDimensions> => {
                return element.getRect();
            })
    }

    public getCenterPoint(): Promise<Point> {
        return this.getWebElement()
            .then((element: TkWebElement<WD>): Promise<Point> => {
                return element.getCenterPoint();
            })
    }

    private getElementLocationInViewFromElement = (pr: Promise<TkWebElement<WD>>): Promise<ElementLocationInView> => {
        return pr.then((element: TkWebElement<WD>): Promise<ElementLocationInView> => {
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
            .then((element: any): TkWebElement<WD> => {
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