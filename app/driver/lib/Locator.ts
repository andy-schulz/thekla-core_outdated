export class By{
    public function: string | Function = ``;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public args: any[];
    public searchText: string = ``;

    private constructor(
        public selectorType: string,
        public selector: string) {

    }

    public static css(selector: string): By {
        return new By(`byCss`, selector);
    }

    public static xpath(selector: string): By {
        return new By(`byXpath`, selector);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static js(script: string | Function, ...varArgs: any[]): By {
        let by = new By(`byJs`, script.toString());
        by.function = script;
        by.args = varArgs;
        return by;
    }

    public static cssContainingText(selector: string, searchText: string): By {
        let by = new By(`byCssContainingText`, selector);
        by.searchText = searchText;
        return by;
    }

    public toString(): string {
        return `${this.selectorType}: ${this.selector}`
    }
}