import {getLogger, Logger}      from "log4js";
import {until}                  from "selenium-webdriver";
import {
    WebElementFinder,
    WebElementListFinder,
    FrameElementFinder
}                               from "../interface/WebElements";
import {UntilElementCondition}  from "../lib/ElementConditions";
import {By}                     from "../lib/Locator";
import {BrowserWdjs}            from "./BrowserWdjs";
import {LocatorWdjs}            from "./LocatorWdjs";
import {FrameHelper, WdElement} from "./interfaces/WdElement";
import {WebElementListWdjs}     from "./WebElementListWdjs";


export class FrameElementWdjs implements FrameElementFinder {
    private _description = "";
    private logger: Logger = getLogger("FrameElementWdjs");
    constructor(
        public switchFrame: FrameHelper,
        private _locator: By,
        private browser: BrowserWdjs) {
    }
    public element(
        locator: By): WebElementFinder {

        return (<WebElementListWdjs>this.all(locator)).toWebElement();
    }

    public all(
        locator: By): WebElementListFinder {

        const loc = LocatorWdjs.getSelector(locator);
        let getElements = () => {
            return this.switchFrame()
                .then(() => this.browser.driver.findElements(loc))
                .then((elements) => {
                    return elements;
                })
        };

        return new WebElementListWdjs(getElements,locator, this.browser);
    }

    shallWait(condition: UntilElementCondition): FrameElementFinder {
        const loc = LocatorWdjs.getSelector(this._locator);


        const createSwitchFrame = () => {
            let switchFrame = (() => {
                return new Promise((fulfill, reject) => {
                    this.switchFrame.element()
                        .then((element: WdElement) => this.browser.driver.wait(
                            until.elementIsVisible(element),
                            condition.timeout,
                            `${condition.conditionHelpText} ${this.toString()}`))
                        .then(() => this.switchFrame())
                        .then(() => fulfill())
                        .catch(e => reject(e));
                });
            }) as FrameHelper;

            switchFrame.element = this.switchFrame.element;

            return switchFrame;
        };

        return new FrameElementWdjs(createSwitchFrame(),this._locator, this.browser);
    }



    frame(locator: By): FrameElementFinder {
        const loc = LocatorWdjs.getSelector(locator);


        const createSwitchFrame = () => {
            const driver = this.browser.driver;
            let frameSwitched = false;

            let switchFrame = (() => {
                return new Promise((fulfill, reject) => {
                    let promise = frameSwitched ? Promise.resolve() : this.switchFrame();

                    promise
                        .then(() => {frameSwitched = true; return;})
                        .then(() => driver.switchTo().frame(driver.findElement(loc)))
                        .then(fulfill)
                        .catch(e => reject(e));
                });
            }) as FrameHelper;

            switchFrame.element = () => {
                return new Promise((fulfill, reject) => {
                    let promise = frameSwitched ? Promise.resolve() : this.switchFrame();
                    promise
                        .then(() => {frameSwitched = true; return;})
                        .then(() => driver.findElement(loc))
                        .then((element: WdElement) => fulfill(element))
                        .catch(e => reject(e))
                })
            };
            return switchFrame;
        };

        return new FrameElementWdjs(createSwitchFrame(),locator, this.browser);
    }


    get description(): string {
        return this._description;
    }

    public called(description: string): FrameElementFinder {
        this._description = description;
        return this;
    }
}