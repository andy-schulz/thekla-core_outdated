import {WebElementFinder, WebElementListFinder} from "../interface/WebElements";
import {until}                                  from "../lib/Condition";
import {UntilElementCondition}                  from "../lib/ElementConditions";
import {By}                                     from "../lib/Locator";
import {BrowserWdjs}                            from "./BrowserWdjs";
import {LocatorWdjs}                            from "./LocatorWdjs";
import {WdElement}                              from "./interfaces/WdElement";
import {ExecuteConditionWdjs}                   from "./ExecuteConditionWdjs";
import {WebElementWdjs}                         from "./WebElementWdjs";
import {WebElement}                             from "selenium-webdriver";
import {getLogger, Logger}                      from "@log4js-node/log4js-api";

/**
 * List object to wrap the location strategy for finding multiple elements with WebDriverJS
 */
export class WebElementListWdjs implements WebElementListFinder {
    private _description: string = "";
    private logger: Logger = getLogger("WebElementListWdjs");

    constructor(
        public getElements: () => Promise<WebElement[]>,
        private _locator: By,
        public readonly browser: BrowserWdjs) {
    }

    /**
     * Send
     */
    // sendKeys(keySequence: string): Promise<void> {
    //     return new Promise((fulfill) => {
    //         this.getElements().then(() => {
    //             fulfill()
    //         });
    //
    //     })
    // }

    /**
     * find sub elements relative to this current waiter
     * @param locator - selector to find a sub waiter
     */
    element(
        locator: By): WebElementFinder {
        const desc = `'${this.description.replace("'Elements'", "'Element'")}'`;
        return (this.all(locator) as WebElementListWdjs).toWebElement().called(this.description);
    }

    /**
     * find all sub elements relative to this waiter
     * @param locator - selector to find all sub elements
     */
    all(
        locator: By
    ): WebElementListFinder {
        this.logger.debug(`Chains all Elements: ${locator.toString()}`);

        let getElements = async (): Promise<WdElement[]> => {
            this.logger.debug(`Getting ALL elements for locator ${locator.toString()}`);
            const elements = await this.getElements();

            // TODO: Check if this can be done in parallel
            // get all subelements of each element in elements list and put it into an array
            return elements.reduce(async (accPromise, elem): Promise<WebElement[]> => {
                const acc: WebElement[] = await accPromise;
                const elemsList: WebElement[] = await LocatorWdjs.executeSelector(locator, elem, this.browser);
                return [...acc, ...elemsList];
            }, Promise.resolve([] as WebElement[]));
        };
        return new WebElementListWdjs(getElements, locator, this.browser).called(this.description);
    }

    /**
     * wait for
     * @param condition - the waiter condition to wait for
     */
    shallWait(condition: UntilElementCondition): WebElementListFinder {
        this.logger.debug(`Shall Wait for Element: ${this.toString()}`);

        const getElements = async () => {
            this.logger.debug(`shallWait - Start getting elements from function chain: ${this._locator.toString()}`);

            let elements: WdElement[] = await this.getElements();
            const loop = async (): Promise<boolean> => {

                if (elements.length == 0) {
                    elements = await this.getElements();
                    return Promise.resolve(false)
                }
                const mapper = (elem: WdElement): Promise<boolean> => {
                    const el = ExecuteConditionWdjs.execute(condition, elem);
                    return el;
                };

                const arr: Promise<boolean>[] = elements.map(mapper);


                return Promise.all(arr).then((arr: boolean[]) => {
                    return Promise.resolve(arr.some(b => b === true))
                })
            };

            return this.browser.wait(until(loop), condition.timeout, `${condition.conditionHelpText} ${this.toString()}`)
                .then(() => this.getElements())
        };

        return new WebElementListWdjs(getElements, this._locator, this.browser).called(this.description);
    }


    count(): Promise<number> {
        return new Promise((fulfill, reject) => {
            this.getElements().then((elems: WdElement[]) => {
                fulfill(elems.length);
            }).catch((e: any) => {
                reject(e);
            });
        })
    }

    getText(): Promise<string[]> {
        return new Promise((fulfill, reject) => {
            this.getElements()
                .then((elems: WdElement[]) => {
                    fulfill(Promise.all(elems.map((elem: WdElement) => elem.getText())))
                }).catch((e: any) => {
                reject(e);
            })
        })
    }

    public toWebElement(): WebElementWdjs {
        return new WebElementWdjs(this);
    }

    public filteredByText(searchText: string): WebElementListFinder {

        const oldGetElements = this.getElements;

        const reducer = (acc: Promise<WdElement[]>, element: WdElement) => {
            return acc.then((arr: WdElement[]) => {
                return element.getText()
                    .then((text: string) => {
                        if (text.includes(searchText)) {
                            arr.push(element);
                        }
                        return arr;
                    });
            })
        };

        let getElements = async (): Promise<WdElement[]> => {
            const elements = await oldGetElements();
            return elements.reduce(reducer, Promise.resolve([]));
        };

        return new WebElementListWdjs(getElements, this._locator, this.browser);
    }

    public called(description: string): WebElementListFinder {
        this._description = description;
        return this;
    }

    get description(): string {
        return this._description;
    }

    get locatorDescription() {
        return this._locator.toString();
    }

    toString(): string {
        return `'${this._description ? this._description : "Elements"}' selected by: >>${this._locator.toString()}<<`;
    }
}