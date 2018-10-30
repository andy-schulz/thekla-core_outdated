import {WebElementFinder, WebElementListFinder} from "../../interface/WebElements";

export class WebElementWdjs implements WebElementFinder{

    constructor(private elementList: WebElementListFinder) {

    }

    sendKeys() {

    }
}