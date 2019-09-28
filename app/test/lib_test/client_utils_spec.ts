import {parseBrowserVersion} from "../../driver/lib/client/client_utils";

describe(`Using the client utils`, (): void => {
    describe(`to format the browser version`, (): void => {
        it(`should return 0 for all version parts 
        - (test case id: 87e320d9-e95f-41a8-ae8e-d89c94f0cb0b)`, (): void => {
            const expected = {
                major: 0,
                minor: 0,
                patch: 0
            };

            expect(parseBrowserVersion()).toEqual(expected);
            expect(parseBrowserVersion(``)).toEqual(expected);
        });

        it(`should return 0 for all version parts when only the version separator is passed 
        - (test case id: f79e11f7-a632-4d87-8e00-b6ddd859755c)`, (): void => {
            const expected = {
                major: 0,
                minor: 0,
                patch: 0
            };

            expect(parseBrowserVersion(`....`)).toEqual(expected);
        });

        it(`should return the major version 
        - (test case id: 5219763e-0ac4-4fda-85b4-36a93e817365)`, (): void => {
            const expected = {
                major: 123,
                minor: 0,
                patch: 0
            };

            expect(parseBrowserVersion(`123`)).toEqual(expected);
        });

        it(`should return the minor version 
        - (test case id: f86d9726-f3e4-40fe-8c4a-ea235a4965f6)`, (): void => {
            const expected = {
                major: 123,
                minor: 456,
                patch: 0
            };

            expect(parseBrowserVersion(`123.456`)).toEqual(expected);
        });

        it(`should return the minor version 
        - (test case id: 9ff55b75-7646-4e7c-a8d0-ddc6da1532c5)`, (): void => {
            const expected = {
                major: 123,
                minor: 456,
                patch: 789
            };

            expect(parseBrowserVersion(`123.456.789`)).toEqual(expected);
        });
    });
});