export interface ElementLocationInView {
    boundingRect: {
        top: number;
        bottom: number;
        left: number;
        right: number;
        height: number;
        width: number;
        x: number;
        y: number;
    };
    innerHeight: number;
    innerWidth: number;
}

export interface Point {
    x: number;
    y: number;
}

export const isElementInViewPort = (loc: ElementLocationInView): boolean => {
    if(loc.boundingRect.top < 0 || loc.boundingRect.top > loc.innerHeight)
        return false;

    if(loc.boundingRect.bottom < 0 || loc.boundingRect.bottom > loc.innerHeight)
        return false;

    if(loc.boundingRect.left < 0 || loc.boundingRect.left > loc.innerWidth)
        return false;

    if(loc.boundingRect.right < 0 || loc.boundingRect.right > loc.innerWidth)
        return false;

    return true;
};

export const getElementsCG = (loc: Promise<ElementLocationInView>): Promise<Point> => {
    return loc.then((loc: ElementLocationInView): Point => {
        return {
            x: Math.trunc(loc.boundingRect.x + loc.boundingRect.width/2),
            y: Math.trunc(loc.boundingRect.y + loc.boundingRect.height/2)
        }
    })
};