import {WebElementFinder, WebElementListFinder} from "../../interface/WebElements";
import {By} from "./Locator";
import {WebElementListWdjs} from "../wdjs/WebElementListWdjs";


// function element(locator: By): WebElementFinder {
//     return (<WebElementListWdjs>all(locator)).toWebElement().is(`'Element' selected by: >>${locator.toString()}<<`);
// }
//
// function all(locator: By): WebElementListFinder {
//     const loc = locator.getSelector(Environment.framework);
//     let getElements = async () => {
//         return await this.driver.findElements(loc);
//     };
//
//     return new WebElementListWdjs(getElements).is(`'Elements' selected by: >>${locator.toString()}<<`);
// }