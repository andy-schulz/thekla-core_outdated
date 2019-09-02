import {Client}       from "webdriver"
import * as uuid      from "uuid"
import {TkWebElement} from "../../driver/interface/TkWebElement";
import {getLogger}    from "@log4js-node/log4js-api";

/* eslint-disable @typescript-eslint/no-non-null-assertion */

export class AnnotatorWdio {
    private logger = getLogger(this.constructor.name);
    private elementBefore: any = undefined;
    private styleBefore: string | undefined = undefined;

    private promise: Promise<void | any> = Promise.resolve();

    // id must start with a letter, so i put an "a" in front of it, just in case the uuid starts with a number
    private readonly uuid = `a` + uuid.v4().toString();

    private static driverMap: Map<Client, AnnotatorWdio> = new Map();

    private funcToString = (func: Function | string) => {
        return `return (${func}).apply(null, arguments);`
    };

    /**
     *  hide the test message element
     *
     *  @param elementId id of test message element
     *
     *  @returns void
     */
    private readonly hideMessage = function () {
        let alert = document.querySelector(`#${ arguments[0]}`);

        if(alert) {
            // @ts-ignore
            alert.style.display = `none`;
        }

    };

    /**
     * add test message to current page
     *
     * @param elementId id of test message element
     * @param displayedText text to display on the test message
     * @param testMessageOptions options describing the style of the test message
     *
     * @returns void
     */
    private readonly displayMessage = function (): void {

        var alert = document.querySelector(`#${arguments[0]}`);

        if(alert) {
            alert.textContent = arguments[1];

            // @ts-ignore
            alert.style.display = `block`;
        } else {
            alert = document.createElement(`div`);
            alert.textContent = arguments[1];
            alert.setAttribute(`id`,arguments[0]);
            alert.setAttribute(`class`,`alert`);
            alert.setAttribute(`style`,`` +
                `z-index: 1000000;` + /* make it incredibly big so that its always on top of other elements */
                `padding: 5px;` +
                `background-color: #f96b6b; /* Red */` +
                `color: white;` +
                `position: fixed;` +
                `opacity: 0.7;` +
                `font-size: 15px;` +
                `top: 0;` +
                `left: 0;` +
                `right: 0;` +
                `margin: auto;` +
                `text-align: center;` +
                ``);
            if(document.body)
                document.body.appendChild(alert);
            else
                console.warn(`can't append child as document.body is missing`)

        }
    };

    private readonly unHighlightElement = function(): void {
        try {
            if(arguments[0] && document.body.contains(arguments[0]) && arguments[1] !== undefined) {
                arguments[0].removeAttribute(`style`);
                arguments[0].setAttribute(`style`,arguments[1])
            }
        } catch(e) {
            console.error(`caught error`)
        }
    };

    private readonly highlightElement = function () {
        if(arguments[0] && document.body.contains(arguments[0])) {
            const oldStyle = arguments[0].getAttribute(`style`);

            const newStyle = `${oldStyle ? oldStyle : ``} /* annotation start */ color: red; border: 2px solid red; /* annotation end */`;
            
            arguments[0].setAttribute(`style`, newStyle);

            return oldStyle
        }

        return;

    };

    /**
     * returns an Annotator instance for the given driver, if it does not already exist, it will be created.
     *
     * @param driver the driver instance which has to be annotated
     * @returns the Annotator instance for the driver
     */
    private static hl(driver: Client): AnnotatorWdio {
        if(AnnotatorWdio.driverMap.has(driver))
            return (AnnotatorWdio.driverMap.get(driver))!;
        else {
            const hl = new AnnotatorWdio();
            AnnotatorWdio.driverMap.set(driver, hl);
            return hl;
        }

    }

    /**
     * add a div in the browsers dom and displays the given test message
     *
     * @param driver the driver instance which has to be annotated
     * @param testMessage the message to display
     */
    private displayTM(driver: Client, testMessage: string): Promise<Client> {
        return this.promise = this.promise
            .then(() => driver.executeScript(this.funcToString(this.displayMessage), [this.uuid, testMessage]))
            .then(() => driver)
    }

    /**
     *
     * @param driver
     */
    private hideTM(driver: Client): Promise<Client> {
        return this.promise = this.promise
            .then(() => driver.executeScript(this.funcToString(this.hideMessage),[this.uuid]))
            .then(() => driver)
    }

    /**
     *
     * @param driver
     * @parm element
     */
    private hlight(driver: Client, element: object): Promise<void> {
        return this.promise = this.promise
            .then(() => {
                return new Promise((resolve, reject) => {
                    driver.executeScript(this.funcToString(this.unHighlightElement),[this.elementBefore, this.styleBefore])
                        .then(resolve, (e: Error) => {
                            if(e.name === `stale element reference`) {
                                this.logger.warn(`stale element reference error detected while unhighlighting an old element.
                            I am going to ignore the error.`);
                                resolve(e)
                            }
                            reject(e)
                        })
                })
            })
            .catch((e): Promise<void> => {
                if(e.toString().includes(`StaleElementReferenceError`)) {
                    return Promise.resolve();
                }
                return Promise.reject(e);
            })
            .then(() => {
                return new Promise((resolve, reject) => {
                    driver.executeScript(this.funcToString(this.highlightElement),[element])
                        .then(resolve, reject)
                })
            })
            .then((style: any) => {
                // @ts-ignore
                this.elementBefore = element;
                this.styleBefore = style === null ? undefined : style;
            })
            .catch((e) => {
                this.elementBefore = undefined;
                console.log(e);
            })
    }

    public reset(): void {
        this.elementBefore = undefined;
        this.styleBefore = undefined;
    }

    /**
     * add a div in the browsers dom and display the given test message
     *
     * @param driver the driver to be annotated
     * @param testMessage the message to display
     *
     * @returns a Promise with an empty object in case the browser function succeeds
     */
    public static displayTestMessage(testMessage: string): (driver: Client) => Promise<Client> {
        return (driver: Client): Promise<Client> => {
            const hl: AnnotatorWdio = AnnotatorWdio.hl(driver);
            return hl.displayTM(driver, testMessage);
        }
    }

    /**
     * hide the test message. Set display: none
     *
     * @param driver the driver to be annotated
     *
     * @returns a Promise with an empty object in case the browser function succeeds
     *
     */
    public static hideTestMessage(driver: Client): Promise<Client> {
        const hl: AnnotatorWdio = AnnotatorWdio.hl(driver);
        return hl.hideTM(driver);
    }

    /**
     * highlight the browsers element (red border and red text)
     *
     * @param driver
     * @param element
     */
    public static highlight(element: TkWebElement<Client>): (driver: Client) => Promise<TkWebElement<Client>> {
        return (driver: Client): Promise<TkWebElement<Client>> => {
            if (!element)
                return Promise.reject(`cant annotate an empty element`);
            const hl: AnnotatorWdio = AnnotatorWdio.hl(driver);
            return hl.hlight(driver, element.getFrWkElement())
                .then((): TkWebElement<Client> => element)
        }
    }

    public static resetHighlighter(driver: Client): Promise<Client> {
        const hl: AnnotatorWdio = AnnotatorWdio.hl(driver);
        hl.reset();
        return Promise.resolve(driver);
    }
}