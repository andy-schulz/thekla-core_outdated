export interface ElementDimensions {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface BoundingRect extends ElementDimensions {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface ElementLocationInView {
    boundingRect: BoundingRect;
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

export const getCenterPoint = (dimension: ElementDimensions): Point => {
    return {
        x: Math.trunc(dimension.x + dimension.width/2),
        y: Math.trunc(dimension.y + dimension.height/2)
    }
};

export const centerDistance = (point1: Point, point2: Point): Point => {
    return {
        x: point2.x - point1.x,
        y: point2.y - point1.y
    }
};

export const getElementsCG = (loc: Promise<ElementLocationInView>): Promise<Point> => {
    return loc.then((loc: ElementLocationInView): Point => {
        return getCenterPoint(loc.boundingRect)
    })
};
