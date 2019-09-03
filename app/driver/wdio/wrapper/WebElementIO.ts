import {getLogger}                                                       from "@log4js-node/log4js-api";
import {Client}                                                          from "webdriver"
import {PointerActionSequence, PointerMoveAction}                        from "../../interface/Actions";
import {TkWebElement}                                                    from "../../interface/TkWebElement";
import {PromiseAny}                                                      from "../../interface/Types";
import {
    centerDistance,
    ElementDimensions,
    ElementLocationInView,
    getCenterPoint,
    Point
} from "../../lib/element/ElementLocation";
import {By}                                                              from "../../lib/element/Locator";
import fp                                                                from "lodash/fp"
import {funcToString}                                                    from "../../utils/Utils";

// @ts-ignore
import {isElementDisplayed} from "../../lib/client_side_scripts/is_displayedness";
import {LocatorWdio}        from "../LocatorWdio";

export interface ElementRefIO {
    [key: string]: string;
}

export class WebElementIO implements TkWebElement<Client> {
    private logger = getLogger(`WebElementIO`);
    private constructor(
        private htmlElement: ElementRefIO,
        private client: Client) {
    }

    public static create(ioElement: ElementRefIO, client: Client): WebElementIO {
        return new WebElementIO(ioElement, client)
    }

    public static createAll(ioElements: ElementRefIO[], client: Client): WebElementIO[] {
        return ioElements.map((element: ElementRefIO): WebElementIO => {
            return WebElementIO.create(element, client)
        })
    }

    private getElementKey(): string {
        return Object.keys(this.htmlElement)[0]
    }

    public getElementId(): string {
        return this.htmlElement[this.getElementKey()]
    }

    public getFrWkElement(): ElementRefIO {
        return this.htmlElement;
    }

    public click(): Promise<void> {
        return this.client.elementClick(this.getElementId()) as unknown as Promise<void>
    }

    public getText(): Promise<string> {
        return this.client.getElementText(this.getElementId()) as unknown as Promise<string>
    }

    public clear(): Promise<void> {
        return this.client.elementClear(this.getElementId()) as unknown as Promise<void>
    }

    public sendKeys(keySequence: string): Promise<void> {

        // chrome driver 2.4x required to send the text as an array not as a string
        // @ts-ignore
        if (this.client.isChrome && !this.client.isW3C)
            return this.client.elementSendKeys(this.getElementId(), [keySequence]) as unknown as Promise<void>;
        // @ts-ignore
        if (this.client.isMobile)
            return this.client.elementSendKeys(this.getElementId(), keySequence, keySequence.split(``)) as unknown as Promise<void>;

        return this.client.elementSendKeys(this.getElementId(), keySequence) as unknown as Promise<void>
    }

    public getAttribute(attributeName: string): Promise<string> {
        return this.client.getElementAttribute(this.getElementId(), attributeName) as unknown as Promise<string>
    }

    public getProperty(propertyName: string): Promise<string> {
        return this.client.getElementProperty(this.getElementId(), propertyName) as unknown as Promise<string>
    }

    public isDisplayed(): Promise<boolean> {
        // @ts-ignore
        if (this.client.isW3C && !this.client.isMobile)
            return this.client.executeScript(funcToString(isElementDisplayed), [this.htmlElement]);

        return this.client.isElementDisplayed(this.getElementId()) as unknown as Promise<boolean>
    }

    public isEnabled(): Promise<boolean> {
        return this.client.isElementEnabled(this.getElementId()) as unknown as Promise<boolean>
    }

    public scrollIntoView = (): Promise<void> => {

        const scrollIntoView = (element: any): void => {
            // @ts-ignore
            return element.scrollIntoView();
        };

        return this.client.executeScript(funcToString(scrollIntoView), [this.htmlElement])
            .then(() => this.htmlElement);
    };

    public getLocationInView = (): Promise<ElementLocationInView> => {
        const boundingRect = (element: any) => {
            const locationInfo: any = {};
            locationInfo.boundingRect = element.getBoundingClientRect();
            locationInfo.innerWidth = window.innerWidth;
            locationInfo.innerHeight = window.innerHeight;
            return locationInfo
        };
        const func = `return (${boundingRect}).apply(null, arguments);`;

        return this.client.executeScript(func, [this.htmlElement]);
    };

    public move(): (client: Client) => Promise<Client> {
        return this.moveToElement(this.htmlElement);
    }

    private moveToElement = (element: ElementRefIO): (client: Client) => Promise<Client> => {
        return (client: Client) => {
            return this.scrollIntoView()
                .then(() => {
                    return this.getCenterPointInView()
                })
                .then((centerPoint: Point) => {
                    return [{
                        type: `pointer`,
                        id: `myMouse`,
                        parameters: {"pointerType": `mouse`},
                        actions: [{
                            type: `pointerMove`,
                            duration: 500,
                            origin: `viewport`,
                            x: centerPoint.x,
                            y: centerPoint.y,
                        }]
                    }] as PointerActionSequence[];
                })
                .then((actions: PointerActionSequence[]): Promise<void> => client.performActions(actions) as unknown as Promise<void>)
                .then(() => client);
        }
    };

    public getRect(): Promise<ElementDimensions> {
        return this.client.getElementRect(this.getElementId()) as unknown as Promise<ElementDimensions>;
    }

    public getCenterPointInView(): Promise<Point> {

        const getDimension = (location: ElementLocationInView) => {
            return location.boundingRect
        };

        return this.getLocationInView()
            .then(getDimension)
            .then(getCenterPoint)
    }

    public getCenterPoint(): Promise<Point> {
        return this.getRect().then(getCenterPoint)
    }

    public findElements(locator: By): Promise<TkWebElement<Client>[]> {
        if (this.logger.isDebugEnabled())
            this.logger.debug(`finding child Elements for locator ${locator} and element ${JSON.stringify(this.htmlElement)}`)
        return LocatorWdio.retrieveElements(locator, this.htmlElement)(this.client)
    }
}