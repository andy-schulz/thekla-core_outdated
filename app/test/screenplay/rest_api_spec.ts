import * as yargs                                                             from "yargs";
import {
    Actor, RestAbilityOptions, UseTheRestApi, Get, Post, On, Send, Method, See, Response, RestApiFactory, request
} from "../..";

import {configure}   from "log4js";
import {curry}       from "lodash";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

const config = {
    levels: {
        "STEP": { "value": 19001, "colour": "magenta" },
        "STEPDETAILS": { "value": 19000, "colour": "magenta" }
    },
    appenders: {
        "output": {
            "type": "stdout"
        }
    },
    categories: {
        "default": {
            "appenders": ["output"],
            "level": "ERROR"
        }
    }
};
// @ts-ignore
configure(config);
// @ts-ignore

describe('Trying to Add two numbers by the mathjs API', () => {
    const a = 5;
    const b = -3;
    const calculationResult = 2;
    let restConfig: RestAbilityOptions;
    let restConfig2: RestAbilityOptions;
    let statusCode: number | undefined;
    let extractor: (request: any) => any;
    let andy: Actor;

    beforeAll(() => {


        restConfig = {
            restClient: "request",
            baseUrl: "http://api.mathjs.org/v4",
            resolveWithFullResponse: true,
        };

        restConfig2 = {
            restClient: "request",
            baseUrl: "http://api.mathjs.org/v5", // wrong base Url, should throw an error when used
            resolveWithFullResponse: true,
        };


        if (yargs.argv.proxy) {
            restConfig.proxy = yargs.argv.proxy;
        } else if(yargs.argv._[0].includes("proxy=")) {
            restConfig.proxy = yargs.argv._[0].replace("proxy=","");
        }

        extractor = (request: any) => {
            statusCode = request.response ? request.response.statusCode: undefined;
        };

        andy = Actor.named("Andy");
        andy.whoCan(UseTheRestApi.using(RestApiFactory.create(restConfig)));
    });

    describe('the simple integers should be added together', () => {
        const req = request(On.ressource(`/?expr=${a}%2B${b}`));
        let result: any[] = [];
        const toResult = curry((safeTo: any[], res: any) => safeTo.push(res));

        afterEach(() => {
            result = [];
        });

        it('when using the GET request' +
            '- (test case id: 87b6d0ac-d022-4dc6-b0ce-b542550d6be1)', async () => {
            const req = request(On.ressource(`/?expr=${a}%2B${b}`));

            await andy.attemptsTo(
                Get.from(req).andSaveResponse(toResult(result))
            );

            expect(result[0].statusCode).toEqual(200);
            expect(result[0].body).toEqual(`${calculationResult}`);
        });

        it('when using the GET Method and setting it on the Activity' +
            '- (test case id: 80e8f4fe-a623-4e0f-a835-d49f1d507541)', async () => {
            const req = request(On.ressource(`/?expr=${a}%2B${b}`));

            await andy.attemptsTo(
                Send.the(req).as(Method.get())
                    .andSaveResponse(toResult(result))
            );

            expect(result[0].statusCode).toEqual(200);
            expect(result[0].body).toEqual(`${calculationResult}`);
        });

        it('when using the POST request' +
            '- (test case id: d91b70c0-941d-4a67-a64c-a7f666694099)', async () => {
            const conf: RestAbilityOptions = {
                body: JSON.stringify({
                    expr: [
                        `${a} + ${b}`
                    ],
                    "precision": 2
                })
            };

            const req = request(On.ressource(`/`))
                .using(conf);

            await andy.attemptsTo(
                Post.to(req).andSaveResponse(toResult(result))
            );

            expect(result[0].statusCode).toEqual(200);
            expect(JSON.parse(result[0].body).result[0]).toEqual(`${calculationResult}`);
        });

        it('when using the POST Method and setting it on the Activity' +
            '- (test case id: 81089f86-cf3d-4112-bb9f-bfcb5d51cc0b)', async () => {
            const conf: RestAbilityOptions = {
                body: JSON.stringify({
                    expr: [
                        `${a} + ${b}`
                    ],
                    "precision": 2
                })
            };

            const req = request(On.ressource(`/`))
                .using(conf);

            await andy.attemptsTo(
                Send.the(req).as(Method.post())
                    .andSaveResponse(toResult(result))
            );

            expect(result[0].statusCode).toEqual(200);
            expect(JSON.parse(result[0].body).result[0]).toEqual(`${calculationResult}`);
        });
    });

    describe('it should throw an error when the the new config passes a wrong url', () => {
        let result: any[] = [];
        const toResult = curry((safeTo: any[], res: any) => safeTo.push(res));

        afterEach(() => {
            result = []
        });

        it('when using the GET request' +
            '- (test case id: 850015a4-6126-41a6-aa3c-7a6e621fd4b8)', async () => {
            const req = request(On.ressource(`/?expr=${a}%2B${b}`))
                .using(restConfig2);

            try {
                await andy.attemptsTo(
                    Get.from(req).andSaveResponse(toResult(result))
                );
            } catch (e) {
                expect(result[0].statusCode).toEqual(404);
            }
        });

        it('when using the POST request' +
            '- (test case id: 47fc1292-bb55-4de2-a7fc-313b47cf15f3)', async () => {
            const req = request(On.ressource(`/`))
                .using(restConfig2);

            try {
                await andy.attemptsTo(
                    Post.to(req).andSaveResponse(toResult(result))
                );
            } catch (e) {
                expect(result[0].statusCode).toEqual(404);
            }
        });

        it('when using the POST method and setting it on the Activity' +
            '- (test case id: 47fc1292-bb55-4de2-a7fc-313b47cf15f3)', async () => {
            const req = request(On.ressource(`/`))
                .using(restConfig2);

            try {
                await andy.attemptsTo(
                    Send.the(req).as(Method.post()).andSaveResponse(toResult(result))
                );
            } catch (e) {
                expect(result[0].statusCode).toEqual(404);
            }
        });
    });

    describe('it should not throw an error when the catchError parameter is set', () => {
        let result: any[] = [];
        const toResult = curry((safeTo: any[], res: any) => safeTo.push(res));

        afterEach(() => {
            result = []
        });

        it('when using the GET request' +
            '- (test case id: 78835b99-b4c2-47c0-a413-0ad4cb48135b)', async () => {
            const req = request(On.ressource(`/`))
                .using(restConfig2);

            try {
                await andy.attemptsTo(
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

        it('when using the POST request' +
            '- (test case id: 2ea557d7-9967-4b7b-92da-8403aed440c4)', async () => {
            const req = request(On.ressource(`/`))
                .using(restConfig2);

            try {
                await andy.attemptsTo(
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

    describe('it should not return the full response ', () => {
        let result: any[] = [];
        const toResult = curry((safeTo: any[], res: any) => safeTo.push(res));



        afterEach(() => {
            result = [];
        });

        it('when using the GET request' +
            '- (test case id: 7127c2c9-7167-49c8-850f-287a05d49880)', async () => {
            const conf: RestAbilityOptions =  {
                resolveWithFullResponse: false,
                json: true
            };

            const req = request(On.ressource(`/?expr=${a}%2B${b}`))
                .using(conf);

            await andy.attemptsTo(
                Get.from(req).andSaveResponse(toResult(result)),
            );

            expect(result[0]).toEqual(2);
        });

        it('when using the POST request' +
            '- (test case id: ab7b185d-08f9-4277-969b-dc21dfd8091a)', async () => {
            const conf: RestAbilityOptions = {
                resolveWithFullResponse: false,
                json: true,
                body: {
                    "expr": [
                        `${a} + ${b}`
                    ],
                    "precision": 2
                }
            };

            const req = request(On.ressource(`/`))
                .using(conf);

            await andy.attemptsTo(
                Post.to(req).andSaveResponse(toResult(result)),
            );
            expect(result[0].result[0]).toEqual("2");
        });
    });

    describe('when using the Response question', () => {
        it('it should be possible to check the result ' +
            '- (test case id: 7f4b74f0-048f-43b0-81a6-614299229d6f)', () => {
            const req = request(On.ressource(`/?expr=${a}%2B${b}`));

            const theResponseCheck = (respone: any) => {
                expect(respone.statusCode).toEqual(200);
                expect(respone.body).toEqual(`${calculationResult}`);
                return true;
            };

            return andy.attemptsTo(
                See.if(Response.of(req).as(Method.get()))
                    .fulfills(theResponseCheck)
                    .repeatFor(5, 1000),
            );
        });
    });
});