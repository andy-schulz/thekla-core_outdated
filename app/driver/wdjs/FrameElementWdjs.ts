import {getLogger, Logger}     from "@log4js-node/log4js-api";
import {
    WebElementFinder,
    WebElementListFinder,
    FrameElementFinder
}                              from "../interface/WebElements";
import {UntilElementCondition} from "../lib/ElementConditions";
import {By}                    from "../lib/Locator";
import {BrowserWdjs}           from "./BrowserWdjs";
import {ExecuteConditionWdjs}  from "./ExecuteConditionWdjs";
import {LocatorWdjs}           from "./LocatorWdjs";
import {FrameHelper}           from "./interfaces/WdElement";
import {WebElementListWdjs}    from "./WebElementListWdjs";


export class FrameElementWdjs implements FrameElementFinder {
    private _description = "";
    private logger: Logger = getLogger("FrameElementWdjs");
    private conditions: UntilElementCondition[] = [];

    constructor(
        public switchFrame: FrameHelper,
        public parent: FrameElementWdjs | null,
        private _locator: By,
        private browser: BrowserWdjs) {
    }
    public element(
        locator: By): WebElementFinder {

        return (<WebElementListWdjs>this.all(locator)).toWebElement();
    }

    public all(

        locator: By): WebElementListFinder {
        this.logger.debug(`Chains all element from frame: ${locator.toString()}`);

        const loc = LocatorWdjs.getSelector(locator);
        let getElements = () => {
            return this.switchFrame(this.conditions)
                .then(() => this.browser.getDriver())
                .then((driver) => driver.findElements(loc))
                .then((elements) => {
                    return elements; // separate return to debug the elements
                })
        };

        return new WebElementListWdjs(getElements,locator, this.browser);
    }

    shallWait(condition: UntilElementCondition): FrameElementFinder {
        this.conditions.push(condition);
        return this;
    }



    frame(locator: By): FrameElementFinder {
        this.logger.debug(`Chains all frames from frame: ${locator.toString()}`);

        const loc = LocatorWdjs.getSelector(locator);


        const createSwitchFrame = () => {
            let switchFrame = ((conditions: UntilElementCondition[]) => {
                return new Promise((fulfill, reject) => {
                    this.browser.getDriver()
                        .then((driver) => {
                            const reducer = (acc: Promise<boolean>, condition: UntilElementCondition): Promise<boolean> => {
                                return acc.then(() => {
                                    return ExecuteConditionWdjs.execute(condition,driver.findElement(loc))
                                })
                            };

                            this.switchFrame(this.conditions)
                                .then(() => conditions.reduce(reducer, Promise.resolve(true)))
                                .then(() => driver.switchTo().frame(driver.findElement(loc)))
                                .then(fulfill,reject)
                                .catch(reject)
                        })

                });
            }) as FrameHelper;

            return switchFrame;
        };

        return new FrameElementWdjs(createSwitchFrame(),this, locator, this.browser);
    }


    get description(): string {
        return this._description;
    }

    get myIdentifier(): string {
        return `Frame called '${this.description}' identified by >>${this._locator.toString()}<<`
    }

    public called(description: string): FrameElementFinder {
        this._description = description;
        return this;
    }
}