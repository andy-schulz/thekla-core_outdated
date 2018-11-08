import {By as ByWd} from "selenium-webdriver"


export class By{

    constructor(
        private selectorType: string,
        private selector: string) {

    }

    public static css(selector: string): By {
        return new By(`byCss`, selector);
    }

    public toString() {
        return `${this.selectorType}: ${this.selector}`
    }

    public getSelector(framework: string): any {
        switch (framework) {
            case "wdjs":
                switch (this.selectorType) {
                    case "byCss":
                        return ByWd.css(this.selector);
                    default:
                        throw Error(`Selector ${this.selector} not found for framework ${framework}`);
                }
            default:
                throw Error(`Framework ${framework} not found`);

        }
    }
}