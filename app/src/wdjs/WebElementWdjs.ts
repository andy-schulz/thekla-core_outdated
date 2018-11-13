import {WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {WebElementListWdjs} from "./WebElementListWdjs";
import {WebElement} from "selenium-webdriver";
import {By} from "../..";

export class WebElementWdjs implements WebElementFinder{
    private _description: string = "";

    constructor(
        private elementList: WebElementListWdjs) {
    }

    all(locator: By): WebElementListFinder {
        return this.elementList.all(locator);
    };

    element(locator: By): WebElementFinder{
        return this.elementList.element(locator);
    };

    private getWebElement(): Promise<WebElement> {
        return new Promise(async (fulfill, reject) => {
            const elements = await this.elementList.getElements();

            if(elements.length === 0) {
                const message = `No Element found: ${this._description}`;
                reject(message);
                return;
            } else if (elements.length >= 2) {
                const message = `More than one Element found of: ${this._description}. I am going to select the first one.`;
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

    public isVisible() {
        return this.getWebElement()
            .then(element => element.isDisplayed())
            .then(state => state)
            .catch(() => false)
    }

    get description(): string {
        return this._description;
    }

    public is(description: string): WebElementFinder {
        this._description = description;
        return this;
    }

}