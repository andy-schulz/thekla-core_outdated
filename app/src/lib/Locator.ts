import {By as ByWd} from "selenium-webdriver"
let clientSideScripts = require('../../../res/clientsidescripts');

export class By{
    public function: string | Function = "";
    public args: any[];
    public searchText: string = "";

    constructor(
        private selectorType: string,
        private selector: string) {

    }



    public static css(selector: string): By {
        return new By(`byCss`, selector);
    }

    public static js(script: string | Function, ...var_args: any[]): By {
        let by = new By("byJs", script.toString());
        by.function = script;
        by.args = var_args;
        return by;
    }

    public static cssContainingText(selector: string, searchText: string) {
        let by = new By("byCssContainingText", selector);
        by.searchText = searchText;
        return by;
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
                    case "byJs":
                        return ByWd.js(this.function, this.args);
                    case "byCssContainingText":
                        return ByWd.js(clientSideScripts.findByCssContainingText, this.selector, this.searchText);
                    default:
                        throw Error(`Selector ${this.selector} not found for framework ${framework}`);
                }
            default:
                throw Error(`Framework ${framework} not found`);

        }
    }
}