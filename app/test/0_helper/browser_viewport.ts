export interface BoundaryCheck { all: boolean;
    any: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
    top: boolean; }

export const boundingRect = (className: string) => {
    // function taken from https://vanillajstoolkit.com/helpers/isoutofviewport/
    var isOutOfViewport = function (elem: any): BoundaryCheck {

        // Get element's bounding
        var bounding = elem.getBoundingClientRect();

        // Check if it's out of the viewport on each side
        var out: any = {};
        out.top = bounding.top < 0;
        out.left = bounding.left < 0;
        out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
        out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
        out.any = out.top || out.left || out.bottom || out.right;
        out.all = out.top && out.left && out.bottom && out.right;

        return out;

    };

    const elements = document.getElementsByClassName(className);
    // @ts-ignore
    return isOutOfViewport(elements[0]);
};