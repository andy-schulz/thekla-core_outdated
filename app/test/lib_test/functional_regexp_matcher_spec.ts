import {Expected} from "../..";

describe(`Using the regexp matcher`, (): void => {

    describe(`on an empty string`, () => {

        it(`should return an error` +
            ` - (test case id: c2a78b59-3302-4af7-88e1-994be26fef72)`, () => {
            const expected = /a/g;
            const actual = ``;
            try{
                Expected.toMatch(expected)(actual)
            } catch (e) {
                expect(e.toString()).toContain(`'' does not match the given RegExp /a/g`)
            }

        });

        it(`should return an error` +
            ` - (test case id: c2a78b59-3302-4af7-88e1-994be26fef72)`, () => {
            const expected = /google\.de/g;
            const actual = `http://www.google.de`;
            expect(Expected.toMatch(expected)(actual)).toBeTruthy();
        });

    });
});


