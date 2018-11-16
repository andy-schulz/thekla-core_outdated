import {Actor}                               from "../screenplay/Actor";
import {See}                                 from "../screenplay/lib/matcher/See";
import {UseTheRestApi}                       from "../screenplay/rest/abilities/UseTheRestApi";
import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {SppRequest}                          from "../screenplay/rest/interfaces/requests";
import {Response}                            from "../screenplay/rest/questions/Response";

import * as rp from "request-promise-native"
import * as yargs from "yargs";

describe('Trying to Add two numbers by the mathjs API', () => {
    it('simple integers should be added together', async () => {
        const a=2;
        const b=-3;

        let andy = Actor.named("Andy");
        andy.whoCan(UseTheRestApi.using("request"));


        let matcher: (text: SppRequest) => any
            = (response: SppRequest ) => expect(response.toString()).toEqual(`${a+b}`);
            // = (response: SppRequest ) => console.log(`Test: ${response}`);

        await andy.attemptsTo(
            See.if(Response.to(`http://api.mathjs.org/v4/?expr=${a}%2B${b}`)).fulfills(matcher),
        );

    }, 2000000);
});