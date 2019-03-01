import {WebElementFinder, WebElementListFinder} from "../interface/WebElements";
import {UntilElementCondition}                  from "../lib/ElementConditions";
import {WdElement}                              from "./interfaces/WdElement";
import {WebElementListWdjs}                     from "./WebElementListWdjs";
import {By}                                     from "../..";
import {getLogger, Logger}                      from "log4js";


export class WebElementWdjs implements WebElementFinder{
    private _description: string = "";
    private logger: Logger = getLogger("WebElementWdjs");

    constructor(
        private elementList: WebElementListWdjs) {
    }

    all(locator: By): WebElementListFinder {
        return this.elementList.all(locator);
    };

    element(locator: By): WebElementFinder{
        return this.elementList.element(locator);
    };

    private getWebElement(): Promise<WdElement> {
        return new Promise(async (fulfill, reject) => {
            const elements = await this.elementList.getElements()
                .catch(reject);

            // if getElements is rejected just leave the function
            if(!elements) {
                return;
            }

            if(elements.length === 0) {
                const message = `No Element found: ${this.toString()}`;
                reject(message);
                return;
            } else if (elements.length >= 2) {
                const message = `More than one Element found of: ${this.toString()}. I am going to select the first one.`;
                fulfill(elements[0]);
                return;
            } else {
                fulfill(elements[0])
            }
        })
    }

    public click(): Promise<void> {
        return this.getWebElement().then(element => element.click())
    }

    public sendKeys(keySequence: string): Promise<void> {
        return this.getWebElement().then(element => element.sendKeys(keySequence))
    }

    public getText(): Promise<string> {
        return this.getWebElement()
            .then(element => element.getText())
            .then(text => text);
    }

    public getAttribute(attribute: string): Promise<string> {
        return this.getWebElement()
            .then(element => element.getAttribute(attribute))
            .then(text => text);
    }

    public isVisible(): Promise<boolean> {
        return this.isDisplayed()
    }

    public isDisplayed(): Promise<boolean> {
        return this.getWebElement()
            .then(element => element.isDisplayed())
            .then(state => state) // returns a Promise an not the webdriver promise.Promise
            .catch(() => false)
    }

    isEnabled(): Promise<boolean> {
        return this.getWebElement()
            .then(element => element.isEnabled())
            .then(state => state)
            .catch(() => false)
    }

    get description(): string {
        return this.elementList.description + this._description;
    }

    public called(description: string): WebElementFinder {
        this.logger.debug(`Set Description to '${description}'`);
        this.elementList.called(description);
        return this;
    }

    toString(): string {
        return `'${this.elementList.description ? this.elementList.description : "Element"}' selected by: >>${this.elementList.locatorDescription}<<`;
    }


    shallWait(condition: UntilElementCondition): WebElementFinder {
        return (this.elementList.shallWait(condition) as WebElementListWdjs).toWebElement() as WebElementFinder;
    }
}