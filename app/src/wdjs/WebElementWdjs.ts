import {WebElementFinder} from "../../interface/WebElements";
import {WebElementListWdjs} from "./WebElementListWdjs";
import {WebElement} from "selenium-webdriver";

export class WebElementWdjs implements WebElementFinder{

    constructor(
        private elementList: WebElementListWdjs,
        public getDescription: () => string) {
    }

    private getWebElement(): Promise<WebElement> {
        return new Promise(async (fulfill, reject) => {
            const elements = await this.elementList.getElements();

            if(elements.length === 0) {
                const message = `No Element found: ${this.getDescription()}`;
                reject(message);
                return;
            } else if (elements.length >= 2) {
                const message = `More than one Element found of: ${this.getDescription()}. I am going to select the first one.`;
                fulfill(elements[0]);
                return;
            } else {
                fulfill(elements[0])
            }
        })
    }

    public click(): Promise<void> {
        return this.getWebElement().then((element: WebElement) => {
            return element.click();
        })
    }

    public sendKeys(): Promise<void> {
        return new Promise((fulfill) => {

        })
    }
}