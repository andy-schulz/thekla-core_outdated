import {getLogger}               from "@log4js-node/log4js-api";
import {Client}                  from "webdriver"
import {PointerActionSequence}   from "../../interface/Actions";
import {TkWebElement}            from "../../interface/TkWebElement";
import {PromiseAny}              from "../../interface/Types";
import {ElementLocationInView}   from "../../lib/element/ElementLocation";
import {By}                      from "../../lib/element/Locator";
import fp                        from "lodash/fp"
import {funcToString}            from "../../utils/Utils";

// @ts-ignore
import {isElementDisplayed} from "../../lib/client_side_scripts/is_displayedness";
import {LocatorWdio}        from "../LocatorWdio";

export interface ElementRefIO {
    [key: string]: string;
}

interface ElementIODimension {
    x: number;
    y: number;
    width: number;
    height: number;
};

export class WebElementIO implements TkWebElement {
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

    public scrollIntoView = (pr?: PromiseAny): Promise<void> => {

        const scrollIntoView = (element: any): void => {
            // @ts-ignore
            return element.scrollIntoView();
        };

        if (pr)
            return pr.then((): Promise<void> => {
                return this.client.executeScript(funcToString(scrollIntoView), [this.htmlElement]);
            });
        return this.client.executeScript(funcToString(scrollIntoView), [this.htmlElement]);
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

    public move(pr?: Promise<void>): Promise<void> {
        return fp.flow(
            this.scrollIntoView,
            this.moveToElement(this.htmlElement),
        )(pr);
    }

    private moveToElement = (element: ElementRefIO): (pr: Promise<void>) => Promise<void> => {
        return (pr: Promise<void>): Promise<void> => {
            const actions1: PointerActionSequence[] = [
                {
                    type: `pointer`,
                    id: `myMouse`,
                    parameters: {"pointerType": `mouse`},
                    actions: [{
                        type: `pointerMove`,
                        duration: 1000,
                        origin: element,
                        x: 0,
                        y: 0,
                    }]
                }
            ];

            return pr.then((): Promise<void> => this.client.performActions(actions1) as unknown as Promise<void>);
        }
    };

    public getRect(): Promise<object> {
        return this.client.getElementRect(this.getElementId()) as unknown as Promise<object>;
    }

    public findElements(locator: By): Promise<TkWebElement[]> {
        if (this.logger.isDebugEnabled())
            this.logger.debug(`finding child Elements for locator ${locator} and element ${JSON.stringify(this.htmlElement)}`)
        return LocatorWdio.retrieveElements(locator, this.htmlElement)(this.client)
    }
}