import {
    Actor, RestClientConfig, UseTheRestApi, Get, Post, On, Send, Method, See, Response, ExecutingRestClient, request
} from "../../../index";

import {curry} from "lodash";
import fp      from "lodash/fp";

describe(`Trying to Add two numbers by the mathjs API`, (): void => {

    const a = 5;
    const b = -3;
    const calculationResult = 2;
    let restConfig: RestClientConfig;
    let restConfig2: RestClientConfig;
    // let statusCode: number | undefined;
    // let extractor: (request: any) => any;
    let Richard: Actor;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        restConfig = {
            restClientName: `request`,
            requestOptions: {
                baseUrl: `http://api.mathjs.org/v4`,
                resolveWithFullResponse: true,
            }
        };

        restConfig2 = {
            restClientName: `request`,
            requestOptions: {
                baseUrl: `http://api.mathjs.org/v5`, // wrong base Url, should throw an error when used
                resolveWithFullResponse: true,

            }
        };

        if (process.env.MY_PROXY) {
            if (!restConfig.requestOptions)
                restConfig.requestOptions = {};
            (restConfig.requestOptions).proxy = process.env.MY_PROXY;
        }

        Richard = Actor.named(`Richard`);
        Richard.whoCan(UseTheRestApi.with(ExecutingRestClient.from(restConfig)));
    });

    describe(`using two simple integers,`, (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const toResult = curry((saveTo: any[], res: any): number => saveTo.push(res));

        afterEach((): void => {
            result = [];
        });

        it(`it should succeed when using the GET request
        - (test case id: 87b6d0ac-d022-4dc6-b0ce-b542550d6be1)`, async (): Promise<void> => {
            const req = request(On.resource(`/?expr=${a}%2B${b}`));

            try {
                await Richard.attemptsTo(
                    Get.from(req).andSaveResponse(toResult(result))
                );
            } catch (e) {
                console.error(e);
            }

            expect(result[0].statusCode).toEqual(200);
            expect(result[0].body).toEqual(`${calculationResult}`);
        });

        it(`it should succeed when using the GET Method and setting it on the Activity
        - (test case id: 80e8f4fe-a623-4e0f-a835-d49f1d507541)`, async (): Promise<void> => {
            const req = request(On.resource(`/?expr=${a}%2B${b}`));

            await Richard.attemptsTo(
                Send.the(req).as(Method.get())
                    .andSaveResponse(toResult(result))
            );

            expect(result[0].statusCode).toEqual(200);
            expect(result[0].body).toEqual(`${calculationResult}`);
        });

        it(`it should succeed when using the POST request
        - (test case id: d91b70c0-941d-4a67-a64c-a7f666694099)`, async (): Promise<void> => {
            const conf: RestClientConfig = {
                requestOptions: {
                    body: JSON.stringify({
                        expr: [
                            `${a} + ${b}`
                        ],
                        "precision": 2
                    })
                }
            };

            const req = request(On.resource(`/`))
                .using(conf);

            await Richard.attemptsTo(
                Post.to(req).andSaveResponse(toResult(result))
            );

            expect(result[0].statusCode).toEqual(200);
            expect(JSON.parse(result[0].body).result[0]).toEqual(`${calculationResult}`);
        });

        it(`it should succeed when using the POST Method and setting it on the Activity
        - (test case id: 81089f86-cf3d-4112-bb9f-bfcb5d51cc0b)`, async (): Promise<void> => {
            const conf: RestClientConfig = {
                requestOptions: {
                    body: JSON.stringify({
                        expr: [
                            `${a} + ${b}`
                        ],
                        "precision": 2
                    })
                }
            };

            const req = request(On.resource(`/`))
                .using(conf);

            await Richard.attemptsTo(
                Send.the(req).as(Method.post())
                    .andSaveResponse(toResult(result))
            );

            expect(result[0].statusCode).toEqual(200);
            expect(JSON.parse(result[0].body).result[0]).toEqual(`${calculationResult}`);
        });
    });

    describe(`it should throw an error if the the new config passes a wrong url`, (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const toResult = curry((saveTo: any[], res: any): number => saveTo.push(res));

        afterEach((): void => {
            result = []
        });

        it(`when using the GET request
        - (test case id: 850015a4-6126-41a6-aa3c-7a6e621fd4b8)`, async (): Promise<void> => {
            const req = request(On.resource(`/?expr=${a}%2B${b}`))
                .using(restConfig2);

            try {
                await Richard.attemptsTo(
                    Get.from(req).andSaveResponse(toResult(result))
                );
            } catch (e) {
                expect(result[0].statusCode).toEqual(404);
            }
        });

        it(`when using the POST request
        - (test case id: 5279a3f9-ee89-4ba9-9533-69273c992aa2)`, async (): Promise<void> => {
            const req = request(On.resource(`/`))
                .using(restConfig2);

            try {
                await Richard.attemptsTo(
                    Post.to(req).andSaveResponse(toResult(result))
                );
            } catch (e) {
                expect(result[0].statusCode).toEqual(404);
            }
        });

        it(`when using the POST method and setting it on the Activity
        - (test case id: 47fc1292-bb55-4de2-a7fc-313b47cf15f3)`, async (): Promise<void> => {
            const req = request(On.resource(`/`))
                .using(restConfig2);

            try {
                await Richard.attemptsTo(
                    Send.the(req).as(Method.post()).andSaveResponse(toResult(result))
                );
            } catch (e) {
                expect(result[0].statusCode).toEqual(404);
            }
        });
    });

    describe(`it should not throw an error when the catchError parameter is set`, (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const toResult = curry((saveTo: any[], res: any): number => saveTo.push(res));

        afterEach((): void => {
            result = []
        });

        it(`when using the GET request
        - (test case id: 78835b99-b4c2-47c0-a413-0ad4cb48135b)`, async (): Promise<void> => {
            const req = request(On.resource(`/`))
                .using(restConfig2);

            try {
                await Richard.attemptsTo(
                    Get.from(req)
                        .andSaveResponse(toResult(result))
                        .dontFailInCaseOfAnError()
                );
            } catch (e) {
                console.error(e);
                expect(false).toBeTruthy(`The Get Task should not throw an error, but it does!`);
            }

            expect(result[0].statusCode).toEqual(404);
        });

        it(`when using the POST request
        - (test case id: 2ea557d7-9967-4b7b-92da-8403aed440c4)`, async (): Promise<void> => {
            const req = request(On.resource(`/`))
                .using(restConfig2);

            try {
                await Richard.attemptsTo(
                    Post.to(req)
                        .andSaveResponse(toResult(result))
                        .dontFailInCaseOfAnError()
                );
            } catch (e) {
                console.error(e);
                expect(false).toBeTruthy(`The Post Task should not throw an error, but it does!`);
            }

            expect(result[0].statusCode).toEqual(404);
        });

    });

    describe(`it should not return the full response `, (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const toResult = curry((saveTo: any[], res: any): number => saveTo.push(res));

        afterEach((): void => {
            result = [];
        });

        it(`when using the GET request
        - (test case id: 7127c2c9-7167-49c8-850f-287a05d49880)`, async (): Promise<void> => {
            const conf: RestClientConfig = {
                requestOptions: {
                    resolveWithFullResponse: false,
                    json: true
                }
            };

            const req = request(On.resource(`/?expr=${a}%2B${b}`))
                .using(conf);

            await Richard.attemptsTo(
                Get.from(req).andSaveResponse(toResult(result)),
            );

            expect(result[0]).toEqual(2);
        });

        it(`when using the POST request
        - (test case id: ab7b185d-08f9-4277-969b-dc21dfd8091a)`, async (): Promise<void> => {
            const conf: RestClientConfig = {
                requestOptions: {
                    resolveWithFullResponse: false,
                    json: true,
                    body: {
                        "expr": [
                            `${a} + ${b}`
                        ],
                        "precision": 2
                    }
                }
            };

            const req = request(On.resource(`/`))
                .using(conf);

            await Richard.attemptsTo(
                Post.to(req).andSaveResponse(toResult(result)),
            );
            expect(result[0].result[0]).toEqual(`2`);
        });
    });

    describe(`when using the Response question`, (): void => {

        it(`it should be possible to check the result 
        - (test case id: 7f4b74f0-048f-43b0-81a6-614299229d6f)`, (): Promise<void> => {

            const req = request(On.resource(`/?expr=${a}%2B${b}`))
                .using({requestOptions: {resolveWithFullResponse: true}});

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const containing = curry((cResult: string, stCode: number, respone: any,): void => {
                expect(respone.statusCode).toEqual(stCode);
                expect(respone.body).toEqual(cResult);
            });

            return Richard.attemptsTo(
                See.if(Response.of(req).as(Method.get()))
                    .is(fp.compose((): boolean => true, (containing(`${calculationResult}`)(200))))
                    .repeatFor(5, 1000),
            );
        });
    });

    describe(`and passing new options when sending the request`, (): void => {
        const conf: RestClientConfig = {
            requestOptions: {
                resolveWithFullResponse: false,
                json: true,
                body: {
                    "expr": [
                        `4 + 5`
                    ],
                    "precision": 2
                }
            }
        };

        const conf2: RestClientConfig = {
            requestOptions: {
                resolveWithFullResponse: false,
                json: true,
                body: {
                    "expr": [
                        `14 + 5`
                    ],
                    "precision": 2
                }
            }
        };

        it(`when using the POST request
        - (test case id: eed39ad3-9369-4a70-a6a5-2e0503e84169)`, async (): Promise<void> => {

            let result: {} = {};

            const toResult = (actual: {}): void => {
                result = actual;
            };

            const req = request(On.resource(`/`))
                .using(conf);

            await Richard.attemptsTo(
                Post.to(req)
                    .withConfig(conf2)
                    .andSaveResponse(toResult),
            );

            expect(result).toEqual({result: [`9`, `19`], error: null})
        });

        it(`when using the POST request executed by the general Send Interaction
        - (test case id: 6cd57c7f-ce71-4774-bed2-6514cb7bc404)`, async (): Promise<void> => {

            let result: {} = {};

            const toResult = (actual: {}): void => {
                result = actual;
            };

            const req = request(On.resource(`/`))
                .using(conf);

            await Richard.attemptsTo(
                Send.the(req)
                    .as(Method.post())
                    .withConfig(conf2)
                    .andSaveResponse(toResult)
            );

            expect(result).toEqual({result: [`9`, `19`], error: null})
        });
    });
});