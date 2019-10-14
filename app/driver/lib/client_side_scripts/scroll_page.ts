export const scrollTo = ({x, y}: {x: number; y: number}): void => {
    return window.scrollTo(x,y<0 ? document.body.scrollHeight : y)
};

export const scrollIntoView = (element: any): void => {
    return element.scrollIntoView();
};

export const boundingRect = (element: any) => {
    const locationInfo: any = {};
    locationInfo.boundingRect = element.getBoundingClientRect();
    locationInfo.innerWidth = window.innerWidth;
    locationInfo.innerHeight = window.innerHeight;
    return locationInfo
};