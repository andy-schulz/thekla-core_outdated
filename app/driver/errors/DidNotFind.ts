import {WebElementFinder} from "../interface/WebElements";

export class DidNotFind extends Error {

    public static theElement(element: WebElementFinder): DidNotFind {
        return new DidNotFind(element)
    }

    private  constructor(private _element: WebElementFinder) {
        super(`
        Did not find the Element: ${_element.toString()}.
        Try waiting before you interact with it:
            element(By.<<your selector>>)
                .shallWait(UntilElement.is.visible())
        `);
        Error.captureStackTrace(this, DidNotFind)
    }

    public get element(): WebElementFinder {
        return this._element;
    }
}