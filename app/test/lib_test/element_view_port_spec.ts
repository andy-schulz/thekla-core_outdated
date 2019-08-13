import {ElementLocationInView, isElementInViewPort} from "../../driver/lib/element/ElementLocation";

describe(`Given an element is displayed on a page-`, (): void => {
    describe(`When it is inside the view port -`, (): void => {

        it(`Then it should return true in case the element is inside the view port and not touching the border 
        - (test case id: 5c9a3db3-fb2d-404c-84da-bb44a7fd100c)`,  (): void => {
            const fullyInside: ElementLocationInView = {
                boundingRect: {
                    bottom: 400,
                    height: 100,
                    left: 300,
                    right: 400,
                    top: 300,
                    width: 100,
                    x: 300,
                    y: 300},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(fullyInside))
                .toBeTruthy(`did not recognize that the element is fully inside the viewport`);
        });

        it(`Then it should return true in case the element is on the upper left corner 
        - (test case id: a659556a-abd4-425f-8553-d06c905f5348)`, () => {
            const topLeftCorner: ElementLocationInView = {
                boundingRect: {
                    bottom: 100,
                    height: 100,
                    left: 0,
                    right: 100,
                    top: 0,
                    width: 100,
                    x: 100,
                    y: 100},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(topLeftCorner))
                .toBeTruthy(`Did not recognize that the element is on the top left corner`);
        });

        it(`Then it should return true in case the element is on the upper right corner 
        - (test case id: 20c163aa-f052-4453-8644-1723db571dec)`, (): void => {
            const topRightCorner: ElementLocationInView = {
                boundingRect: {
                    bottom: 100,
                    height: 100,
                    left: 400,
                    right: 0,
                    top: 0,
                    width: 100,
                    x: 100,
                    y: 100},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(topRightCorner))
                .toBeTruthy(`Did not recognize that the element is on the top right corner`);
        });

        it(`Then it should return true in case the element is on the lower left corner 
        - (test case id: c24350dd-f315-4fad-b32d-e13d81554ed1)`, (): void => {
            const lowerLeftCorner: ElementLocationInView = {
                boundingRect: {
                    bottom: 500,
                    height: 100,
                    left: 0,
                    right: 100,
                    top: 400,
                    width: 100,
                    x: 100,
                    y: 100},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(lowerLeftCorner))
                .toBeTruthy(`Did not recognize that the element is on the lower left corner`);
        });

        it(`Then it should return true in case the element is on the lower right corner 
        - (test case id: 4beede5d-ab67-4d59-b95d-ff17d68e9790)`, (): void => {
            const lowerRightCorner: ElementLocationInView = {
                boundingRect: {
                    bottom: 500,
                    height: 100,
                    left: 400,
                    right: 500,
                    top: 400,
                    width: 100,
                    x: 100,
                    y: 100},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(lowerRightCorner))
                .toBeTruthy(`Did not recognize that the element is on the lower right corner`);
        });

    });

    describe(`When it is on the view port border -`, (): void => {

        it(`Then it should return false in case its on the left view port border  
        - (test case id: ff0114ad-6eb7-4d27-9c59-0aa63b6df3ca)`,  (): void => {
            const leftBorder: ElementLocationInView = {
                boundingRect: {
                    top: 200,
                    bottom: 300,
                    left: -50,
                    right: 50,
                    width: 100,
                    height: 100,
                    x: 300,
                    y: 300},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(leftBorder))
                .toBeFalsy(`check failed when element overlaps the left view port border`)
        });

        it(`Then it should return false in case its on the top view port border  
        - (test case id: 4edd4f82-dbf2-4566-bfdb-34bb1a98b4a2)`,  (): void => {
            const topBorder: ElementLocationInView = {
                boundingRect: {
                    top: -50,
                    bottom: 50,
                    left: 200,
                    right: 300,
                    width: 100,
                    height: 100,
                    x: -50,
                    y: 200},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(topBorder))
                .toBeFalsy(`check failed when element overlaps the top view port border`)
        });

        it(`Then it should return false in case its on the right view port border  
        - (test case id: 5b679623-bb02-4dc0-9dbe-b0fe2bd36959)`,  (): void => {
            const rightBorder: ElementLocationInView = {
                boundingRect: {
                    top: 200,
                    bottom: 300,
                    left: 450,
                    right: 550,
                    width: 100,
                    height: 100,
                    x: 450,
                    y: 200},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(rightBorder))
                .toBeFalsy(`check failed when element overlaps the right view port border`)
        });

        it(`Then it should return false in case its on the lower view port border  
        - (test case id: 50d26044-4d34-4b4f-bcce-13919b3110c7)`,  (): void => {
            const lowerBorder: ElementLocationInView = {
                boundingRect: {
                    top: 450,
                    bottom: 550,
                    left: 200,
                    right: 300,
                    width: 100,
                    height: 100,
                    x: 200,
                    y: 450},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(lowerBorder))
                .toBeFalsy(`check failed when element overlaps the lower view port border`)
        });

    });

    describe(`When it is outside the view port -`, (): void => {

        it(`Then it should return false in case its outside the upper view port border 
        - (test case id: d12583ef-04b3-4bf2-991e-935c87c2143c)`, (): void => {
            const outsideUpperBorder: ElementLocationInView = {
                boundingRect: {
                    top: -150,
                    bottom: -50,
                    left: 200,
                    right: 300,
                    width: 100,
                    height: 100,
                    x: 200,
                    y: -150},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(outsideUpperBorder))
                .toBeFalsy(`check failed when element is outside the upper view port border`)
        });

        it(`Then it should return false in case its outside the right view port border 
        - (test case id: 1128b0bb-b9f1-4dbc-b5a6-4b9a24d47b8a)`, (): void => {
            const outsideRightBorder: ElementLocationInView = {
                boundingRect: {
                    top: 200,
                    bottom: 300,
                    left: 550,
                    right: 650,
                    width: 100,
                    height: 100,
                    x: 550,
                    y: 200},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(outsideRightBorder))
                .toBeFalsy(`check failed when element is outside the right view port border`)
        });

        it(`Then it should return false in case its outside the lower view port border 
        - (test case id: fbcffb6f-460b-4064-aa6b-9841e33446e5)`, (): void => {
            const outsideLowerBorder: ElementLocationInView = {
                boundingRect: {
                    top: 550,
                    bottom: 650,
                    left: 200,
                    right: 300,
                    width: 100,
                    height: 100,
                    x: 200,
                    y: 550},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(outsideLowerBorder))
                .toBeFalsy(`check failed when element is outside the lower view port border`)
        });

        it(`Then it should return false in case its outside the left view port border 
        - (test case id: 534de158-00b5-4eea-b071-065fb0cded80)`, (): void => {
            const outsideLeftBorder: ElementLocationInView = {
                boundingRect: {
                    top: 200,
                    bottom: 300,
                    left: -150,
                    right: -50,
                    width: 100,
                    height: 100,
                    x: -150,
                    y: 200},
                innerHeight: 500,
                innerWidth: 500
            };

            expect(isElementInViewPort(outsideLeftBorder))
                .toBeFalsy(`check failed when element is outside the left view port border`)
        });

    });
});