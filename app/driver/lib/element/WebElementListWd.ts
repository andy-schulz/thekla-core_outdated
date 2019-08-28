import {Browser}                                from "../../interface/Browser";
import {ClientCtrls}                            from "../../interface/ClientCtrls";
import {TkWebElement}                           from "../../interface/TkWebElement";
import {WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {UntilElementCondition}                  from "./ElementConditions";
import {By}                                     from "./Locator";
import {waitForCondition}                       from "./shall_wait";
import {WebElementWd}                           from "./WebElementWd";
import {getLogger, Logger}                      from "@log4js-node/log4js-api";

/**
 * List object to wrap the location strategy for finding multiple elements with WebDriverJS
 */
export class WebElementListWd<WD> implements WebElementListFinder {
    private _description: string = ``;
    private logger: Logger = getLogger(`WebElementListWd`);

    public constructor(
        public getElements: () => Promise<TkWebElement[]>,
        private _locator: By,
        public readonly browser: ClientCtrls<WD>,
        private createWebElementFromList: (elementList: WebElementListWd<WD>,
            browser: ClientCtrls<WD>) => WebElementWd<WD>) {
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
    public element(
        locator: By): WebElementFinder {
        const desc = `'${this.description.replace(`'Elements'`, `'Element'`)}'`;
        return (this.all(locator) as WebElementListWd<WD>).toWebElement().called(this.description);
    }

    /**
     * find all sub elements relative to this element
     * @param locator - selector to find all sub elements
     */
    public all(
        locator: By
    ): WebElementListFinder {
        this.logger.debug(`Chains all Elements: ${locator.toString()}`);

        let getElements = async (): Promise<TkWebElement[]> => {
            this.logger.debug(`Getting ALL elements for locator ${locator.toString()}`);
            const elements = await this.getElements();
            this.logger.debug(`Got ${elements.length} elements for locator ${locator.toString()}`);

            // TODO: Check if this can be done in parallel
            // get all subelements of each element in elements list and put it into an array
            return elements.reduce(async (accPromise, elem): Promise<TkWebElement[]> => {
                const acc: TkWebElement[] = await accPromise;
                // const elemsList: TkWebElement[] = await LocatorWdjs.executeSelector(locator, elem, this.browser);
                // const elemsList: TkWebElement[] = await this.executeSelector(locator, elem, this.browser);
                const elemsList: TkWebElement[] = await elem.findElements(locator);
                return [...acc, ...elemsList];
            }, Promise.resolve([] as TkWebElement[])).then((elements: TkWebElement[]) => {
                this.logger.trace(`Found ${elements ? elements.length : 0} element(s) for locator '${locator}'`);
                return elements
            });
        };
        return new WebElementListWd(getElements, locator, this.browser, this.createWebElementFromList).called(this.description);
    }

    /**
     * wait for
     * @param condition - the waiter condition to wait for
     */
    public shallWait(condition: UntilElementCondition): WebElementListFinder {
        this.logger.debug(`Shall Wait for Element: ${this.toString()}`);

        const getElements = async (): Promise<TkWebElement[]> => {
            this.logger.debug(`shallWait - Start getting elements from function chain: ${this._locator.toString()}`);

            return waitForCondition(
                this.browser as unknown as Browser,
                this.getElements,
                `${condition.conditionHelpText} ${this.toString()}`,
                this._locator.toString(),
                this.logger
            )(condition)
        };

        return new WebElementListWd(getElements, this._locator, this.browser, this.createWebElementFromList).called(this.description);
    }

    public count(): Promise<number> {
        return new Promise((fulfill, reject): void => {
            this.getElements().then((elems: TkWebElement[]): void => {
                fulfill(elems.length);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }).catch((e: any): void => {
                reject(e);
            });
        })
    }

    public getText(): Promise<string[]> {
        return new Promise((fulfill, reject): void => {
            this.getElements()
                .then((elems: TkWebElement[]): void => {
                    fulfill(Promise.all(
                        elems.map((elem: any): Promise<string> => elem.getText())
                    ))
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }).catch((e: any): void => {
                    reject(e);
                })
        })
    }

    public toWebElement(): WebElementWd<WD> {
        return this.createWebElementFromList(this, this.browser);
    }

    public filteredByText(searchText: string): WebElementListFinder {

        const oldGetElements = this.getElements;

        const reducer = (acc: Promise<TkWebElement[]>, element: any): Promise<TkWebElement[]> => {
            return acc.then((arr: TkWebElement[]): Promise<TkWebElement[]> => {
                return new Promise((resolve, reject) => {
                    element.getText()
                        .then((text: string) => {
                            if (text.includes(searchText)) {
                                arr.push(element);
                            }
                            resolve(arr);
                        });
                })
            })
        };

        let getElements = async (): Promise<TkWebElement[]> => {
            const elements = await oldGetElements();
            return elements.reduce(reducer, Promise.resolve([]));
        };

        return new WebElementListWd(getElements, this._locator, this.browser, this.createWebElementFromList);
    }

    public called(description: string): WebElementListFinder {
        this._description = description;
        return this;
    }

    public get description(): string {
        return this._description;
    }

    public get locatorDescription(): string {
        return this._locator.toString();
    }

    public toString(): string {
        return `'${this._description ? this._description : `Elements`}' selected by: >>${this._locator.toString()}<<`;
    }
}