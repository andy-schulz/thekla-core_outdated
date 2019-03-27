import {objectContains} from "../..";

describe('Using the object contains matcher', () => {

    describe('on two empty objects', () => {

        it('of type Object, it should return true' +
            ' - (test case id: c2a78b59-3302-4af7-88e1-994be26fef72)', () => {
            const expected = {};
            const actual = {};
            expect(objectContains(expected)(actual)).toBeTruthy()
        });

        it('where expected is a string and actual an object, it should return true ' +
            '- (test case id: 1e23a03d-b1de-49a9-8fdb-3284d299f8c0)', () => {
            const expected = "{}";
            const actual = {};
            expect(objectContains(expected)(actual)).toBeTruthy()
        });

        it('where expected is an Object and actual a string, it should return true' +
            ' - (test case id: 2a7ae30b-0827-4871-92e9-05e70ebca8f8)', () => {
            const expected = {};
            const actual = "{}";
            expect(objectContains(expected)(actual)).toBeTruthy()
        });

        it('of type string, it should return true ' +
            '- (test case id: 712dc7ad-5881-4773-9867-9ac8f4d60b90)', () => {
            const expected = "{}";
            const actual = "{}";
            expect(objectContains(expected)(actual)).toBeTruthy()
        });
    });

    describe('on two equal objects', () => {
        it('both of type Object, it should return true' +
            '- (test case id: 8328f143-fd2d-43ea-9450-cb3161281bb0)', () => {
            const expected = {version: "a"};
            const actual = {version: "a"};
            expect(objectContains(expected)(actual)).toBeTruthy()
        });

        it('where expected is of type string and actual of type Object, it should return true' +
            '- (test case id: 893aa843-2fb4-41ba-8bfd-c7ab25cfc00b)', () => {
            const expected = {version: "a"};
            const actual = {version: "a"};
            expect(objectContains(JSON.stringify(expected))(actual)).toBeTruthy()
        });

        it('where expected is of type Object and actual of type string, it should return true' +
            ' - (test case id: b5c5a571-8022-4d31-bb3f-17663bc2b750)', () => {
            const expected = {version: "a"};
            const actual = {version: "a"};
            expect(objectContains(expected)(JSON.stringify(actual))).toBeTruthy()
        });

        it('both of type string, it should return true' +
            ' - (test case id: 91458b2b-1bba-4120-9bad-51599793d75d)', () => {
            const expected = {version: "a"};
            const actual = {version: "a"};
            expect(objectContains(JSON.stringify(expected))(JSON.stringify(actual))).toBeTruthy()
        });
    });

    describe('on two different objects', () => {
        it('both of type object and actual contains expected, it should return true' +
            ' - (test case id: f14196bc-bc49-48f2-b353-6700c4cdd56f)', () => {
            const expected = {version: "a"};
            const actual = {
                firstVersion: "b",
                version: "a"
            };
            expect(objectContains(expected)(actual)).toBeTruthy()
        });

        it('both of type object and actual does not contain expected, it should return false' +
            ' - (test case id: 4b4b5ee2-7d39-43f8-afa5-dd4ba2dc2e85)', () => {
            const expected = {version: "a"};
            const actual = {
                firstVersion: "b",
                version: "b"
            };

            try {
                const result = objectContains(expected)(actual);
                expect(false).toBeTruthy(`should throw an error, but it doesnt`)
            } catch (e) {
                expect(e.toString()).toContain(`Error: Differences in Case Response found: [
\t{
\t\t"kind": "E",
\t\t"path": [
\t\t\t"version"
\t\t],
\t\t"lhs": "b",
\t\t"rhs": "a"
\t}
]`)
            }

        });

        it('actual of type string and actual does not contain expected, it should return false' +
            ' - (test case id: cf2a39f0-6b66-41f2-996f-a5b970546d24)', () => {
            const expected = {version: "a"};
            const actual = {
                firstVersion: "b",
                version: "b"
            };

            try {
                const result = objectContains(expected)(JSON.stringify(actual));
                expect(false).toBeTruthy(`should throw an error, but it doesnt`)
            } catch (e) {
                expect(e.toString()).toContain(`Error: Differences in Case Response found: [
\t{
\t\t"kind": "E",
\t\t"path": [
\t\t\t"version"
\t\t],
\t\t"lhs": "b",
\t\t"rhs": "a"
\t}
]`)
            }
        });

        it('both of type object and actual contains expected, it should return true' +
            ' - (test case id: f14196bc-bc49-48f2-b353-6700c4cdd56f)', () => {
            const expected = {version: "a"};
            const actual = {
                firstVersion: "b",
                version: "a"
            };
            expect(objectContains(expected)(actual)).toBeTruthy()
        });
    });
});

