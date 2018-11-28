import {WebElementFinder, WebElementListFinder} from "../interface/WebElements";
import {until}                                  from "../lib/Condition";
import {UntilElementCondition}                  from "../lib/ElementConditions";
import {By}                                     from "../lib/Locator";
import {BrowserWdjs}                            from "./BrowserWdjs";
import {LocatorWdjs}                            from "./LocatorWdjs";
import {WdElement}                              from "./WdElement";
import {WebElementWdjs}                         from "./WebElementWdjs";
import {ThenableWebDriver, WebElement}          from "selenium-webdriver";


export class WebElementListWdjs implements WebElementListFinder{
    private _description: string = "";
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

    element(
        locator: By): WebElementFinder {
        const desc = `'${this.description.replace("'Elements'","'Element'")}'`;
        return <WebElementFinder>(<WebElementListWdjs>this.all(locator)).toWebElement().called(desc);
    }

    all(
        locator: By): WebElementListFinder {

        let getElements = async (): Promise<WdElement[]> => {
            const elements = await this.getElements();

            let els: WdElement[] = [];

            // TODO: Check if this can be done in parallel
            for (const elem of elements) {
                const elemsList = await LocatorWdjs.executeSelector(locator, elem, this.browser);
                els = [...els, ...elemsList];
            }

            return Promise.resolve(els);
        };

        return new WebElementListWdjs(getElements,locator, this.browser);
    }

    shallWait(condition: UntilElementCondition): WebElementListFinder {
        const getElements = async () => {

            const elements: WdElement[] = await this.getElements();

            const loop = (): Promise<boolean> => {
                if(elements.length == 0) {
                    return Promise.resolve(false)
                }

                const mapper = async (elem: WdElement): Promise<boolean> => {
                    const el = elem.isDisplayed();
                    return el;
                };

                const arr: Promise<boolean>[] = elements.map(mapper);

                return Promise.all(arr).then((arr: boolean[]) => {
                    return Promise.resolve(arr.some(b => b === true))
                })
            };

            return this.browser.wait(until(loop),condition.timeout, `${condition.conditionHelpText} ${this.toString()}`)
                .then(() => this.getElements())
        };

        return new WebElementListWdjs(getElements,this._locator, this.browser);
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
                        if(text.includes(searchText)) {
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

        return new WebElementListWdjs(getElements,this._locator, this.browser);
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