import * as yargs                          from "yargs";
import {Actor}                             from "../../screenplay/Actor";
import {Extract}                           from "../../screenplay/lib/matcher/Extract";
import {See}                               from "../../screenplay/lib/matcher/See";
import {RestAbilityOptions, UseTheRestApi} from "../../screenplay/rest/abilities/UseTheRestApi";
import {Get}                               from "../../screenplay/rest/actions/Get";
import {SppRequestResult}                  from "../../screenplay/rest/interfaces/requests";
import {Response}                          from "../../screenplay/rest/questions/Response";

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
        }

        extractor = (request: SppRequestResult) => {
            statusCode = request.response ? request.response.statusCode: undefined;
        };
    });

    it('simple integers should be added together', async () => {


        let matcher: (response: SppRequestResult) => any
            = (response: SppRequestResult) => expect(response.toString()).toEqual(`${result}`);

        let andy = Actor.named("Andy");
        andy.whoCan(UseTheRestApi.using(restConfig));
        await andy.attemptsTo(
            See.if(Response.of(Get.from(`/?expr=${a}%2B${b}`))).fulfills(matcher),
        );
    });

    it('simple integers should be added together', async () => {

        let andy = Actor.named("Andy");
        andy.whoCan(UseTheRestApi.using(restConfig));
        await andy.attemptsTo(
            Extract.the(Response.of(Get.from(`/?expr=${a}%2B${b}`))).by(extractor),
        );
    });

    it('simple integers should be added together', async () => {

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