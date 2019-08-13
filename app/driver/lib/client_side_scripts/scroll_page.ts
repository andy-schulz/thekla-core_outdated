export const scrollTo = ({x, y}: {x: number; y: number}): void => {
    return window.scrollTo(x,y<0 ? document.body.scrollHeight : y)
};