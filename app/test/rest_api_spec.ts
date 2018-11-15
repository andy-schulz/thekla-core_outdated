import {Actor}                               from "../screenplay/Actor";
import {See}                                 from "../screenplay/lib/matcher/See";
import {UseTheRestApi}                       from "../screenplay/rest/abilities/UseTheRestApi";
import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {Response} from "../screenplay/rest/questions/Response";


describe('Trying to Add two numbers by the mathjs API', () => {
    it('simple integers should be added together', async () => {
        let restClient: AxiosInstance = axios.create();

        let andy = Actor.named("Andy");
        andy.whoCan(UseTheRestApi.using(restClient));

        const a=2;
        const b=-3;
        let matcher: (text: AxiosResponse) => boolean
            = (response: AxiosResponse ) => expect(response.data).toEqual(a+b);

        await andy.attemptsTo(
            See.if(Response.to(`http://api.mathjs.org/v4/?expr=${a}%2B${b}`)).fulfills(matcher),
        );

    }, 2000000);
});