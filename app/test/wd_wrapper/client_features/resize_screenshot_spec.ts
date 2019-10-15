import {
    Browser, RunningBrowser, BrowserScreenshotData, ServerConfig, DesiredCapabilities, ClientHelper
} from "../../..";

import {setBrowserStackName, standardCapabilities, standardServerConfig} from "../../0_helper/config";
import {cloneDeep}                                                       from "lodash";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sizeOf = require(`image-size`);

describe(`Resize a screenshot`, (): void => {
    let browser: Browser;

    const tablesPage = `${process.env.BASEURL ? process.env.BASEURL : `http://localhost:3000`}/tables`;

    const conf: ServerConfig = cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = cloneDeep(standardCapabilities);
    setBrowserStackName(capabilities, `resize_screenshot_spec.ts - browser1`);

    beforeAll(async (): Promise<void> => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
        await ClientHelper.cleanup();
        browser = ClientHelper.create(conf, capabilities);
        await browser.window.setSize({width: 500, height: 500});
    });

    afterAll((): Promise<void[]> => {
        return ClientHelper.cleanup();
    });

    describe(`from a single browser as base64 string`, (): void => {
        it(`should return a 5x5 png` +
            `- (test case id: 464d2df4-2bd3-4f53-a503-159294fe086e)`, async (): Promise<void> => {

            await browser.get(tablesPage);
            const bsd5Browser: BrowserScreenshotData = await browser.takeScreenshot({size: {width: 20}});
            const imageBinary = new Buffer(bsd5Browser.browserScreenshotData, `base64`);
            expect(sizeOf(imageBinary).width).toEqual(20);
        });
    });

    describe(`from multiple browser as base64 string`, (): void => {
        let browser2: Browser;

        const capabilities2 = cloneDeep(capabilities);
        setBrowserStackName(capabilities2, `resize_screenshot_spec.ts - browser2`);

        beforeAll(async (): Promise<void> => {
            browser2 = ClientHelper.create(conf, capabilities2);
            await browser2.window.setSize({width: 500, height: 500});
        });

        it(`should return two resized images from ClientHelper` +
            `- (test case id: 662919d7-241d-4b61-a161-eccb1c4d4c1f)`, async (): Promise<void> => {

            await browser.get(tablesPage);
            await browser2.get(tablesPage);

            const imagesBase64: BrowserScreenshotData[] = await ClientHelper.takeScreenshots({size: {height: 30}});

            expect(imagesBase64.length).toEqual(2);

            const imageBinary0 = new Buffer(imagesBase64[0].browserScreenshotData, `base64`);
            const imageBinary1 = new Buffer(imagesBase64[1].browserScreenshotData, `base64`);

            expect(sizeOf(imageBinary0).height).toEqual(30,
                `Failed image resize check for ${imagesBase64[0].browserName}`);
            expect(sizeOf(imageBinary1).height).toEqual(30,
                `Failed image resize check for ${imagesBase64[1].browserName}`);

        });

        it(`should return two resized images from RunningBrowser 
        - (test case id: 26f13d63-c5e0-4526-85fc-d8515b7cabaa)`, async (): Promise<void> => {

            await browser.get(tablesPage);
            await browser2.get(tablesPage);

            const imagesBase64: BrowserScreenshotData[] = await RunningBrowser.takeScreenshots({
                size: {
                    width: 40,
                    height: 40
                }
            });

            expect(imagesBase64.length).toEqual(2);

            const imageBinary0 = new Buffer(imagesBase64[0].browserScreenshotData, `base64`);
            const imageBinary1 = new Buffer(imagesBase64[1].browserScreenshotData, `base64`);

            expect(sizeOf(imageBinary0).height).toEqual(40,
                `Failed image resize check for ${imagesBase64[0].browserName}`);
            expect(sizeOf(imageBinary1).height).toEqual(40,
                `Failed image resize check for ${imagesBase64[1].browserName}`);

        });
    });

});