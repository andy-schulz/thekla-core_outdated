import {getLogger, Logger}     from "@log4js-node/log4js-api";
import {
    WebElementFinder,
    WebElementListFinder,
    FrameElementFinder
}                                       from "../interface/WebElements";
import {UntilElementCondition}          from "../lib/ElementConditions";
import {By}                             from "../lib/Locator";
import {BrowserWdjs}                    from "./BrowserWdjs";
import {ExecuteConditionWdjs}           from "./ExecuteConditionWdjs";
import {LocatorWdjs}                    from "./LocatorWdjs";
import {FrameHelper}                    from "./interfaces/WdElement";
import {WebElementListWdjs}             from "./WebElementListWdjs";
import {promise, WebDriver, WebElement} from "selenium-webdriver";


export class FrameElementWdjs implements FrameElementFinder {
    private _description = ``;
    private logger: Logger = getLogger(`FrameElementWdjs`);
    private conditions: UntilElementCondition[] = [];

    public constructor(
        public switchFrame: FrameHelper,
        public parent: FrameElementWdjs | null,
        private _locator: By,
        private browser: BrowserWdjs) {
    }
    public element(
        locator: By): WebElementFinder {

        return (this.all(locator) as WebElementListWdjs).toWebElement();
    }

    public all(

        locator: By): WebElementListFinder {
        this.logger.debug(`Chains all element from frame: ${locator.toString()}`);

        const loc = LocatorWdjs.getSelector(locator);
        let getElements = (): Promise<WebElement[]> => {
            return this.switchFrame(this.conditions)
                .then((): Promise<WebDriver> => this.browser.getDriver())
                .then((driver): promise.Promise<WebElement[]> => driver.findElements(loc))
                .then((elements): WebElement[] => {
                    return elements; // separate return to debug the elements
                })
        };

        return new WebElementListWdjs(getElements,locator, this.browser);
    }

    public shallWait(condition: UntilElementCondition): FrameElementFinder {
        this.conditions.push(condition);
        return this;
    }



    public frame(locator: By): FrameElementFinder {
        this.logger.debug(`Chains all frames from frame: ${locator.toString()}`);

        const loc = LocatorWdjs.getSelector(locator);


        const createSwitchFrame = (): (conditions: UntilElementCondition[]) => Promise<void> => {
            return ((conditions: UntilElementCondition[]): Promise<void> => {
                return new Promise((fulfill, reject): void => {
                    this.browser.getDriver()
                        .then((driver): void => {
                            const reducer = (acc: Promise<boolean>, condition: UntilElementCondition): Promise<boolean> => {
                                return acc.then((): Promise<boolean> => {
                                    return ExecuteConditionWdjs.execute(condition,driver.findElement(loc))
                                })
                            };

                            this.switchFrame(this.conditions)
                                .then((): Promise<boolean> => conditions.reduce(reducer, Promise.resolve(true)))
                                .then((): promise.Promise<void> => driver.switchTo().frame(driver.findElement(loc)))
                                .then(fulfill,reject)
                                .catch(reject)
                        })

                });
            }) as FrameHelper;
        };

        return new FrameElementWdjs(createSwitchFrame(),this, locator, this.browser);
    }


    public get description(): string {
        return this._description;
    }

    public get myIdentifier(): string {
        return `Frame called '${this.description}' identified by >>${this._locator.toString()}<<`
    }

    public called(description: string): FrameElementFinder {
        this._description = description;
        return this;
    }
}