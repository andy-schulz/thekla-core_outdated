export class By{
    public function: string | Function = "";
    public args: any[];
    public searchText: string = "";

    constructor(
        public selectorType: string,
        public selector: string) {

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
}