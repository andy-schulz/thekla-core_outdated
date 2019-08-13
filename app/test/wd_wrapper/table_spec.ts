import {
    Browser, By, ServerConfig, DesiredCapabilities, ClientHelper
} from "../..";

describe(`a simple table`, (): void => {
    const conf: ServerConfig = {
        automationFramework: {
            type: process.env.FRAMEWORK === `wdio` ? `wdio` : `wdjs`,
            logLevel:  `warn`
        },
        serverAddress: {
            hostname: `localhost`,
        },
        baseUrl: process.env.BASEURL ? process.env.BASEURL : `http://framework-tester.test-steps.de`
    };

    const capabilities: DesiredCapabilities = {
        browserName: process.env.BROWSERNAME ? process.env.BROWSERNAME : `chrome`,
        proxy: {
            type: `direct`
        }
    };

    console.log(`process.env.BROWSERNAME ${process.env.BROWSERNAME}`);
    console.log(capabilities);

    let browser: Browser;

    beforeAll((): void => {
        browser = ClientHelper.create(conf, capabilities);
    });

    afterAll(async (): Promise<void[][]> => {
        return await ClientHelper.cleanup()
    });

    it(`select elements by 
    - (test case id: 48788a13-ade7-4b76-b366-8eae26a1194d)`, async (): Promise<void> => {
        const list = browser.all(By.css(`table tr`)).filteredByText(`James`);

        await browser.get(`/tables`);
        const tableText: string[] = await list.getText();
        expect(await list.count()).toBe(2);
        expect(tableText.length).toBe(2);
        expect(tableText.toString()).toContain(`James`);
    }, 40000);
});