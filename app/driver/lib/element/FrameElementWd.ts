import {Logger}                                                     from "@log4js-node/log4js-api";
import {ClientCtrls}                                                from "../../interface/ClientCtrls";
import {FrameElementFinder, WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {WebElementWdjs}                                             from "../../wdjs/WebElementWdjs";
import {UntilElementCondition}                                      from "./ElementConditions";
import {TkWebElement}                                               from "../../interface/TkWebElement";
import {Browser, By}                                                from "../../..";
import {waitForCondition}                                           from "./shall_wait";
import {WebElementListWd}                                           from "./WebElementListWd";


export type FrameCreator<WD> = (getFrames: () => Promise<TkWebElement[]>,
    _locator: By,
    browser: ClientCtrls<WD>) => FrameElementWd<WD>


export abstract class FrameElementWd<WD> implements FrameElementFinder {
    private _description = ``;
    protected abstract logger: Logger;
    private conditions: UntilElementCondition[] = [];

    public constructor(
        public getFrames: () => Promise<TkWebElement[]>,
        private _locator: By,
        private browser: ClientCtrls<WD>,
        private createFrameElement: FrameCreator<WD>) {
    }

    protected abstract switchFrameDriver(driver: WD, element: any): Promise<void>;

    protected abstract findElementsDriver(locator: By): Promise<TkWebElement[]>;

    public element(
        locator: By): WebElementFinder {

        return (this.all(locator) as WebElementListWd<WD>).toWebElement();
    }

    private switchFrame() {
        return this.getFrames()
            .then((element: TkWebElement[]) => {
                if (element.length === 0) {
                    const message = `not Frame found for locator ${this._locator}! Abort Frame Switch.`;
                    this.logger.debug(message);
                    return Promise.reject(new Error(message))
                }
                return this.browser.getFrameWorkClient()
                    .then((driver: WD): Promise<void> => {
                        this.logger.trace(`SWITCH FRAME: trying to switch to element ${element[0]}`);
                        return this.switchFrameDriver(driver, element[0].getFrWkElement());
                    }).catch((e: Error): Promise<void> => {
                        this.logger.trace(`Error switching to Frame.`);
                        return Promise.reject(e);
                    })
            })
    }

    public all(
        locator: By): WebElementListFinder {
        this.logger.debug(`Chains all element from frame: ${locator.toString()}`);

        let getElements = (): Promise<TkWebElement[]> => {
            return this.switchFrame()
                .then(() => {
                    return this.findElementsDriver(locator);
                })
        };

        return new WebElementListWd(getElements, locator, this.browser as any, WebElementWdjs.create);
    }

    public shallWait(condition: UntilElementCondition): FrameElementFinder {

        const getFrame = async (): Promise<TkWebElement[]> => {
            this.logger.debug(`shallWait - Start getting elements from function chain: ${this._locator.toString()}`);

            return waitForCondition(
                this.browser as unknown as Browser,
                this.getFrames,
                `${condition.conditionHelpText} ${this.toString()}`,
                this._locator.toString(),
                this.logger
            )(condition)
        };

        return this.createFrameElement(getFrame, this._locator, this.browser).called(this.description);
    }


    public frame(locator: By): FrameElementFinder {
        this.logger.debug(`Chains all frames from frame: ${locator.toString()}`);


        const getFrames = (): Promise<TkWebElement[]> => {
            return this.switchFrame()
                .then(() => {
                    return this.findElementsDriver(locator);
                })
        };

        return this.createFrameElement(getFrames, locator, this.browser);
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