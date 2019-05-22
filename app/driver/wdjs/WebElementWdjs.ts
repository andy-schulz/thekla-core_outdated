import {promise, WebDriver, WebElement}         from "selenium-webdriver";
import {DidNotFind}                             from "../errors/DidNotFind";
import {WebElementFinder, WebElementListFinder} from "../interface/WebElements";
import {UntilElementCondition}                  from "../lib/ElementConditions";
import {BrowserWdjs}                            from "./BrowserWdjs";
import {WdElement}                              from "./interfaces/WdElement";
import {WebElementListWdjs}                     from "./WebElementListWdjs";
import {By}                                     from "../..";
import {getLogger, Logger}                      from "log4js";
import {Annotator}                              from "webdriverjs_annotator";


export class WebElementWdjs implements WebElementFinder {
    private _description: string = ``;
    private logger: Logger = getLogger(`WebElementWdjs`);


    public constructor(
        private elementList: WebElementListWdjs,
        private browser: BrowserWdjs) {
    }

    public all(locator: By): WebElementListFinder {
        return this.elementList.all(locator);
    };

    public element(locator: By): WebElementFinder {
        return this.elementList.element(locator);
    };

    private getWebElement(): Promise<WdElement> {
        return new Promise(async (fulfill, reject): Promise<void> => {
            const displayMessage = this.browser.displayTestMessages;

            if (displayMessage) {
                const message = `Trying to find ${this.toString()}`;
                await Annotator.displayTestMessage(await this.browser.getDriver(), message);
            }

            const elements = await this.elementList.getElements()
                .catch((e) => {
                    reject(e);
                });

            const annotate = async (annotateElement: boolean, element: WebElement, driver: WebDriver) => {
                if (annotateElement)
                    await Annotator.highlight(driver, element);
            };

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

            if (displayMessage)
                await Annotator.hideTestMessage(await this.browser.getDriver());

            await annotate(this.browser.annotateElement === true, elements[0], await this.browser.getDriver());
            fulfill(elements[0])
        })
    }

    public click(): Promise<void> {
        return this.getWebElement().then((element): promise.Promise<void> => element.click())
    }

    public hover(): Promise<void> {
        return this.browser.getDriver()
            .then(async (driver: WebDriver): Promise<void> => {
                return this.getWebElement()
                    .then((element: WebElement) => {
                        const toLocation = {
                            x: 0,
                            y: 0,
                            duration: 100,
                            origin: element
                        };

                        // @ts-ignore - webdriver 4.0.0 alpha is used, but there is no typing as of now (2019-05-21)
                        return driver.actions({bridge: true}).move(toLocation).perform();
                    })
            });
    }

    public sendKeys(keySequence: string): Promise<void> {
        return this.getWebElement().then((element): promise.Promise<void> => element.sendKeys(keySequence))
    }

    public getText(): Promise<string> {
        return this.getWebElement()
            .then((element): promise.Promise<string> => element.getText())
            .then((text): string => text);
    }

    public getAttribute(attribute: string): Promise<string> {
        return this.getWebElement()
            .then((element): promise.Promise<string> => element.getAttribute(attribute))
            .then((text): string => text);
    }

    public isVisible(): Promise<boolean> {
        return this.isDisplayed()
    }

    public isDisplayed(): Promise<boolean> {
        return this.getWebElement()
            .then((element): promise.Promise<boolean> => element.isDisplayed())
            .then((state): boolean => state) // returns a Promise and not the webdriver promise.Promise
            .catch((): boolean => false)
    }

    public isEnabled(): Promise<boolean> {
        return this.getWebElement()
            .then((element): promise.Promise<boolean> => element.isEnabled())
            .then((state): boolean => state)
            .catch((): boolean => false)
    }

    public clear(): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.getWebElement()
                .then((element): promise.Promise<void> => element.clear())
                .then(resolve, reject)
                .catch(reject)
        })
    }

    public get description(): string {
        return this.elementList.description + this._description;
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
        return (this.elementList.shallWait(condition) as WebElementListWdjs).toWebElement() as WebElementFinder;
    }
}