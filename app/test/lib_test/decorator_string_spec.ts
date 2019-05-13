import {stringReplace} from "../../screenplay/lib/decorators/decoratorStrings";

describe(`replacing a string`, (): void => {
    describe(`in a decorator`, () => {
        it(`should replace a single replament string - (test case id: f0ef5f5c-c6b7-43fc-a290-6bb6c3533742)`, () => {
            const test = {
                element: `My string`
            };

            test.toString = stringReplace(`The output is: <<element>>`);
            expect(test.toString()).toEqual(`The output is: My string`)
        });

        it(`shouldnt replace anything without a replacer - (test case id: d2882247-9d15-459e-9b9b-6974ab09dfca)`, () => {
            const test = {
                element: `My string`
            };

            test.toString = stringReplace(`The output is: element`);
            expect(test.toString()).toEqual(`The output is: element`);
        });

        it(`should replace multiple replacer - (test case id: 510db34c-2b62-4b43-968a-09d329437628)`, () => {
            const test = {
                element: `My string`,
                newElement: `Second String`
            };

            test.toString = stringReplace(`The output is: <<element>> and a <<newElement>>`);
            expect(test.toString()).toEqual(`The output is: My string and a Second String`);
        });

        it(`should replace an object - (test case id: a56d9e38-77e1-459f-bcd9-8e0e5082965c)`, () => {
            const test = {
                element: `My string`,
                newElement: {
                    attribute: `the attribute`
                }
            };

            test.toString = stringReplace(`The output is: <<element>> and a <<newElement>>`);
            expect(test.toString()).toEqual(`The output is: My string and a {"attribute":"the attribute"}`);
        });
    });
});