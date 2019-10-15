import {
    Browser, By, ServerConfig, DesiredCapabilities, ClientHelper
}                                                                               from "../..";
import {setBrowserStackSessionName, standardCapabilities, standardServerConfig} from "../0_helper/config";
import {cloneDeep}                                                              from "lodash";

describe(`a simple table`, (): void => {

    const conf: ServerConfig = cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = cloneDeep(standardCapabilities);
    setBrowserStackSessionName(capabilities, `table_spec.ts`);

    let browser: Browser;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        browser = ClientHelper.create(conf, capabilities);
    });

    afterAll(async (): Promise<void[]> => {
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
    });
});