import {findByCssContainingText} from "../client_side_scripts/locators";

export const ByType = {
    css: `byCss`,
    xpath: `byXpath`,
    accessibilityId: `byAccessibilityId`,
    js: `byJs`,
    cssContainingText: `byCssContainingText`
};

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
        return new By(ByType.css, selector);
    }

    public static xpath(selector: string): By {
        return new By(ByType.xpath, selector);
    }

    public static accessibilityId(selector: string): By {
        return new By(ByType.accessibilityId, selector);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static js(script: string | Function, ...varArgs: any[]): By {
        let by = new By(ByType.js, script.toString());
        by.function = script;
        by.args = varArgs;
        return by;
    }

    public static cssContainingText(selector: string, searchText: string): By {
        let by = new By(ByType.cssContainingText, selector);
        by.function = findByCssContainingText;
        by.args = [selector, searchText];
        return by;
    }

    public toString(): string {
        return `${this.selectorType}: ${this.selector}`
    }
}