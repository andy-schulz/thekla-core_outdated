import * as assert        from "assert";
import {RestClientConfig} from "../../config/RestClientConfig";
import {RestRequestRqst}  from "../../rest/rqst/RestRequestRqst";

class UT extends RestRequestRqst {
    public static testMerge(orig: RestClientConfig, merger: RestClientConfig) {
        return (new UT(`resource`, {})).mergeClientConfig(orig, merger);
    }
}

describe(`Using the RestAPI`, () => {

    describe(`and try to merge request options`, () => {

        it(`should return the merged option object ` +
            `- (test case id: 82878ec9-736b-4db9-912a-139c3ea16949)`, () => {

            const restOptsOrig: RestClientConfig = {
                requestOptions: {
                    body: {
                        one: `one`,
                        array: [`one`]
                    }
                }
            };

            const restOptsMerger: RestClientConfig = {
                requestOptions: {
                    body: {
                        two: `two`,
                        array: [`two`]
                    }
                }
            };

            const result: RestClientConfig = {
                requestOptions: {
                    body: {
                        one: `one`,
                        two: `two`,
                        array: [`one`,`two`]
                    }
                }
            };

            const res = UT.testMerge(restOptsOrig, restOptsMerger);
            assert.deepStrictEqual(res, result)
        });
    });
});