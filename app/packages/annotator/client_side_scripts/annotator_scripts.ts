export const highlightElement = function () {
    /*HIGHLIGHT ELEMENT*/
    if(arguments[0] && document.body.contains(arguments[0])) {
        const oldStyle = arguments[0].getAttribute(`style`);

        const newStyle = `${oldStyle ? oldStyle : ``} /* annotation start */ color: red; border: 2px solid red; /* annotation end */`;

        arguments[0].setAttribute(`style`, newStyle);

        return oldStyle
    }
    return;
};

/**
 *  hide the test message element
 *
 *  @param elementId id of test message element
 *
 *  @returns void
 */
export const hideMessage = function () {
    const alert = document.querySelector(`#${ arguments[0]}`);

    if(alert) {
        // @ts-ignore
        alert.style.display = `none`;
    }

};

export const unHighlightElement = function(): void {
    /*UN-HIGHLIGHT ELEMENT*/
    try {
        if(arguments[0] && document.body.contains(arguments[0]) && arguments[1] !== undefined) {
            arguments[0].removeAttribute(`style`);
            arguments[0].setAttribute(`style`,arguments[1])
        }
    } catch(e) {
        console.error(`caught error`)
    }
};

/**
 * add test message to current page
 *
 * @param elementId id of test message element
 * @param displayedText text to display on the test message
 * @param testMessageOptions options describing the style of the test message
 *
 * @returns void
 */
export const displayMessage = function (): void {

    var alert = document.querySelector(`#${arguments[0]}`);

    if(alert) {
        alert.textContent = arguments[1];

        // @ts-ignore
        alert.style.display = `block`;
    } else {
        alert = document.createElement(`div`);
        alert.textContent = arguments[1];
        alert.setAttribute(`id`,arguments[0]);
        alert.setAttribute(`class`,`alert`);
        alert.setAttribute(`style`,`` +
            `z-index: 1000000;` + /* make it incredibly big so that its always on top of other elements */
            `padding: 5px;` +
            `background-color: #f96b6b; /* Red */` +
            `color: white;` +
            `position: fixed;` +
            `opacity: 0.7;` +
            `font-size: 15px;` +
            `top: 0;` +
            `left: 0;` +
            `right: 0;` +
            `margin: auto;` +
            `text-align: center;` +
            ``);
        if(document.body)
            document.body.appendChild(alert);
        else
            console.warn(`can't append child as document.body is missing`)

    }
};