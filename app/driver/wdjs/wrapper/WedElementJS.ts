import {WebElement, By as ByWd, WebDriver} from "selenium-webdriver";
import {TkWebElement}                      from "../../interface/TkWebElement";
import {ElementLocationInView}             from "../../lib/element/ElementLocation";
import {UntilElementCondition}             from "../../lib/element/ElementConditions";
import {By}                                from "../../lib/element/Locator";

// eslint-disable-next-line @typescript-eslint/no-var-requires
let clientSideScripts = require(`../../../../res/browser/clientsidescripts`);

export class WebElementJS implements TkWebElement {

    private constructor(
        private jsElement: WebElement,
        private driver: WebDriver) {
    }

    public static create(jsElement: WebElement, driver: WebDriver): WebElementJS {
        return new WebElementJS(jsElement, driver)
    }

    public static createAll(jsElements: WebElement[], driver: WebDriver): WebElementJS[] {
        return jsElements.map((element: WebElement): WebElementJS => {
            return WebElementJS.create(element, driver)
        })
    }

    public getFrWkElement(): WebElement {
        return this.jsElement;
    }

    public click(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.jsElement.click()
                .then(resolve, reject)
                .catch(reject)
        });
    }

    public sendKeys(keySequence: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.jsElement.sendKeys(keySequence)
                .then(resolve, reject)
                .catch(reject)
        });
    }

    public getText(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.jsElement.getText()
                .then(resolve, reject)
                .catch(reject)
        });
    }

    public getAttribute(attributeName: string): Promise<string> {
        return new Promise((resolve, reject): void => {
            this.jsElement.getAttribute(attributeName)
                .then(resolve, reject)
                .catch(reject);
        })
    }

    public getProperty(propertyName: string): Promise<string> {

        const getProperty = (elem: any, propertyName: string): string => {
            // @ts-ignore
            return elem[propertyName];
        };

        const func2 = `return (${getProperty}).apply(null, arguments);`;

        return new Promise((resolve, reject): void=> {
            this.driver[`executeScript`](func2, [this.jsElement, propertyName])
                .then((result: any): void => {
                    resolve(result);
                }, reject);
        });

    }

    public move(): Promise<void> {
        const toLocation = {
            x: 0,
            y: 0,
            duration: 100,
            origin: this.getFrWkElement()
        };
        // @ts-ignore - webdriver 4.0.0 alpha is used, but there is no typing as of now (2019-05-21)
        return this.driver.actions({bridge: true}).move(toLocation).perform();
    }

    public getLocationInView(): Promise<ElementLocationInView> {
        const boundingRect = (element: any) => {
            const locationInfo: any = {};
            locationInfo.boundingRect = element.getBoundingClientRect();
            locationInfo.innerWidth = window.innerWidth;
            locationInfo.innerHeight = window.innerHeight;
            return locationInfo
        };

        return new Promise((resolve, reject) => {
            return this.driver.executeScript<ElementLocationInView>(boundingRect, this.jsElement)
                .then(resolve, reject)
        });
    }



    public getRect(): Promise<object> {
        throw new Error(`getRect of ${this.constructor.name} not implemented yet`)
    }

    public isDisplayed(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.jsElement.isDisplayed()
                .then(resolve, reject)
                .catch(reject)
        })
    }

    public isEnabled(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.jsElement.isEnabled()
                .then(resolve, reject)
                .catch(reject)
        })
    }

    public scrollIntoView(): Promise<void> {

        const scrollIntoView = (element: any) => {
            // @ts-ignore
            return element.scrollIntoView();
        };
        const func = `return (${scrollIntoView}).apply(null, arguments);`;

        return new Promise((resolve, reject): void => {
            this.driver.executeScript(func, this.jsElement)
                .then((result) => {
                    resolve()
                }, reject)
                .catch(reject)
        })
    }

    public findElements(locator: By): Promise<TkWebElement[]> {

        return new Promise((resolve, reject): void => {
            switch (locator.selectorType) {
                case `byCss`:
                    this.jsElement.findElements(ByWd.css(locator.selector))
                        .then(((elements): void => resolve(WebElementJS.createAll(elements, this.driver))),
                            reject)
                        .catch(reject);
                    break;

                case `byXpath`:
                    this.jsElement.findElements(ByWd.xpath(locator.selector))
                        .then(((elements): void => resolve(WebElementJS.createAll(elements, this.driver))),
                            reject)
                        .catch(reject);
                    break;

                case `byJs`:
                    this.jsElement.findElements(ByWd.js(locator.function, locator.args))
                        .then(((elements): void => resolve(WebElementJS.createAll(elements, this.driver))),
                            reject)
                        .catch(reject);
                    break;

                case `byCssContainingText`:
                    this.driver.findElements(
                        ByWd.js(
                            clientSideScripts.findByCssContainingText,
                            locator.selector,
                            locator.searchText,
                            this.jsElement))
                        .then(((elements): void => resolve(WebElementJS.createAll(elements, this.driver))),
                            reject)
                        .catch(reject);
                    break;

                default:
                    throw Error(`Selector ${locator.selectorType} not implemented for framework WebDriverJS`);
            }
        })
    }
}


export interface FrameHelper extends Function {
    (conditions: UntilElementCondition[]): Promise<void>;

    // waiter: (condition: UntilElementCondition) => Promise<boolean>;
}

export interface ElementListHelper extends Function {
    (): () => Promise<WebElementJS[]>;

    // elements?: () => Promise<WdElement[]>;
}