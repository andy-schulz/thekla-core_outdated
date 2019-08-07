import {DesiredCapabilities} from "../../../config/DesiredCapabilities";
import {ServerConfig}        from "../../../config/ServerConfig";
import {Browser}             from "../../../driver/interface/Browser";
import {RunningBrowser}      from "../../../driver/lib/RunningBrowser";
import {ClientWdio}          from "../../../driver/wdio/ClientWdio";


describe(`Using the WebdriverIO client`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    const conf: ServerConfig = {
    };

    const capabilities: DesiredCapabilities = {
        browserName: `firefox`,
    };

    const testUrl = `http://framework-tester.test-steps.de`;

    let client: Browser;

    beforeAll( (): void => {
        client = ClientWdio.create(conf, capabilities);
    });

    beforeEach( (): Promise<void> => {
        return  client.get(testUrl);
    });

    describe(`to work with the page title`, (): void => {
        it(`the getTitle() method should return the title 
        - (test case id: 54e8b8c9-e584-4489-a131-edff900be2f7)`, async (): Promise<void> => {
            expect(await client.getTitle()).toEqual(`React App`);
        });

        it(`the hasTitle() method should check the title string 
        - (test case id: 8f5fbf64-af91-4fd7-b22c-41877b7572ea)`, async (): Promise<void> => {
            expect(await client.hasTitle(`React App`))
                .toEqual(true, `expected the find the correct title`);
            expect(await client.hasTitle(`ReactApp`))
                .toEqual(false, `expected to return false in case the title is not correct`);

        });
    });

    afterAll((): Promise<void[][]> => {
        return RunningBrowser.cleanup();
    })
});