import {containingTheObject, strictEqualTo} from "../..";

describe('Using the ', () => {

    describe('strictEqualTo matcher', () => {

        it('on equal values should not throw an error ' +
            '- (test case id: eadd18a8-4a46-46d8-867c-e2c52f66478a)', () => {
            const comparer = true;
            try {
                strictEqualTo(true) (comparer);
                expect(comparer).toBeTruthy()
            } catch (e) {
                expect(false).toBeTruthy(`The funktion strictEqualTo should not throw an error, but it did.`)
            }

        });

        it('on not equal values should throw an error ' +
            '- (test case id: 3d29b32b-408a-4e63-99ec-0fd5cf5aa3af)', () => {
            const comparer = false;
            try {
                strictEqualTo(true) (comparer);
                expect(true).toBeFalsy(`The function strictEqualTo should  throw an error, but it didn't.`)
            } catch (e) {
                expect(e.toString()).toContain(`AssertionError [ERR_ASSERTION]: false === true`)
            }

        });
    });
});


