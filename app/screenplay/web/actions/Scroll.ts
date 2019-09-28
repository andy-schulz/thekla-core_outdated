/**
 * Action to click on a web element
 */

import {Interaction, SppElement} from "../../../index";
import {stepDetails}             from "../../lib/decorators/step_decorators";
import {FindElements}            from "../abilities/FindElements";
import {UseBrowserFeatures}      from "../abilities/UseBrowserFeatures";
import {SppElementList}          from "../SppWebElements";
import {UsesAbilities}           from "../../Actor";

class PagePosition implements PagePositionInterface {

    public static of(x: number, y: number) {
        return new PagePosition(x, y)
    }

    private constructor(public x: number, public y: number) {
    }

    public inspect(): PagePositionInterface {
        return {x: this.x, y: this.y}
    }

}

export class Page {
    public static top(): PagePosition {
        return PagePosition.of(0, 0);
    }

    public static bottom(): PagePosition {
        return PagePosition.of(0, -1);
    }
}

interface PagePositionInterface {
    x: number;
    y: number;
}


class ElementScroller implements Interaction<void, void> {
    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`scroll to element: '<<element>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return FindElements.as(actor).findElement(this.element).scrollIntoView();
    }

    /**
     * @ignore
     */
    public constructor(public element: SppElement) {
    }
}

class PageScroller implements Interaction<void, void> {
    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`scroll to PagePositon: '<<position>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return UseBrowserFeatures.as(actor).scrollTo(this.pagePosition.inspect());
    }

    /**
     * @ignore
     */
    public constructor(private pagePosition: PagePosition) {
    }
}

export class Scroll {
    /**
     * specify which element or position should be scrolled to
     * @param elementOrPage - the SPP Element or PAge Position
     */
    public static to(elementOrPage: SppElement | SppElementList | PagePosition): ElementScroller | PageScroller {

        if (elementOrPage instanceof SppElement)
            return new ElementScroller(elementOrPage as SppElement);
        else if (elementOrPage instanceof PagePosition)
            return new PageScroller(elementOrPage as PagePosition);

        throw new Error(`Parameter of Scroll.to() should be SppElementList or Page!`)
    }
}

