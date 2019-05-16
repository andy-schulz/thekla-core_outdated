import * as assert       from "assert";
import {RestApiConfig}   from "../../config/RestApiConfig";
import {RestRequestRqst} from "../../rest/rqst/RestRequestRqst";

class UT extends RestRequestRqst {
    public static testMerge(orig: RestApiConfig, merger: RestApiConfig) {
        return (new UT(`resource`, {})).mergeOpts(orig, merger);
    }
}

describe(`Using the RestAPI`, () => {

    describe(`and try to merge request options`, () => {

        it(`should return the merged option object ` +
            `- (test case id: 82878ec9-736b-4db9-912a-139c3ea16949)`, () => {

            const restOptsOrig: RestApiConfig = {
                restClientOptions: {
                    body: {
                        one: `one`,
                        array: [`one`]
                    }
                }
            };

            const restOptsMerger: RestApiConfig = {
                restClientOptions: {
                    body: {
                        two: `two`,
                        array: [`two`]
                    }
                }
            };

            const result: RestApiConfig = {
                restClientOptions: {
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