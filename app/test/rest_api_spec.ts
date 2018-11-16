import * as yargs                          from "yargs";
import {Actor}                             from "../screenplay/Actor";
import {See}                               from "../screenplay/lib/matcher/See";
import {RestAbilityOptions, UseTheRestApi} from "../screenplay/rest/abilities/UseTheRestApi";
import {SppRequest}                        from "../screenplay/rest/interfaces/requests";
import {Response}                          from "../screenplay/rest/questions/Response";

describe('Trying to Add two numbers by the mathjs API', () => {
    it('simple integers should be added together', async () => {
        const a = 5;
        const b = -3;
        const result = 2;

        let restConfig: RestAbilityOptions = {
            restClient: "request",
        };

        if (yargs.argv.proxy) {
            restConfig.proxy = yargs.argv.proxy;
        }

        let matcher: (text: SppRequest) => any
            = (response: SppRequest) => expect(response.toString()).toEqual(`${result}`);

        let andy = Actor.named("Andy");
        andy.whoCan(UseTheRestApi.using(restConfig));
        await andy.attemptsTo(
            See.if(Response.to(`http://api.mathjs.org/v4/?expr=${a}%2B${b}`)).fulfills(matcher),
        );
    })
});