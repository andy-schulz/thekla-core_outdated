import * as yargs                                                             from "yargs";
import {
    Actor, RestAbilityOptions, SppRequestResult, UseTheRestApi, Get, See, Response, Extract
} from "../..";

import {getLogger, configure} from "log4js";
const logger = getLogger("RestApi");

describe('Trying to Add two numbers by the mathjs API', () => {
    const a = 5;
    const b = -3;
    const result = 2;
    let restConfig: RestAbilityOptions;
    let statusCode: number | undefined;
    let extractor: (request: SppRequestResult) => any;

    beforeAll(() => {


        restConfig = {
            restClient: "request",
            baseUrl: "http://api.mathjs.org/v4"
        };
        if (yargs.argv.proxy) {
            restConfig.proxy = yargs.argv.proxy;
        } else if(yargs.argv._[0].includes("proxy=")) {
            restConfig.proxy = yargs.argv._[0].replace("proxy=","");
        }

        extractor = (request: SppRequestResult) => {
            statusCode = request.response ? request.response.statusCode: undefined;
        };
    });

    it('simple integers should be added together ' +
        '- (test case id: 87b6d0ac-d022-4dc6-b0ce-b542550d6be1)', async () => {


        let matcher: (response: SppRequestResult) => any
            = (response: SppRequestResult) => expect(response.toString()).toEqual(`${result}`);

        let andy = Actor.named("Andy");
        andy.whoCan(UseTheRestApi.using(restConfig));
        await andy.attemptsTo(
            See.if(Response.of(Get.from(`/?expr=${a}%2B${b}`))).fulfills(matcher),
        );
    }, 10000);

    it('simple integers should be added together ' +
        '- (test case id: 850015a4-6126-41a6-aa3c-7a6e621fd4b8)', async () => {

        let andy = Actor.named("Andy");
        andy.whoCan(UseTheRestApi.using(restConfig));
        await andy.attemptsTo(
            Extract.the(Response.of(Get.from(`/?expr=${a}%2B${b}`))).by(extractor),
        );
    });

    it('simple integers should be added together ' +
        '- (test case id: 7127c2c9-7167-49c8-850f-287a05d49880)', async () => {

        let conf: RestAbilityOptions =  {
            resolveWithFullResponse: true,
            json: true
        };

        let andy = Actor.named("Andy");
        andy.whoCan(UseTheRestApi.using(restConfig));
        await andy.attemptsTo(
            Extract.the(Response.of(Get.from(`/v4/?expr=${a}%2B${b}`).using(conf))).by(extractor),
        );
    });

});