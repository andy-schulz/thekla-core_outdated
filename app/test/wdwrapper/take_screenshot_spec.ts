import {SeleniumConfig} from "../../config/SeleniumConfig";
import {BrowserWdjs}    from "../../driver/wdjs/BrowserWdjs";
import * as fs          from "fs";
import fsExtra          from "fs-extra";
import {Browser} from "../..";
import * as uuid from "uuid";



describe('Taking a screenshot', () => {
    let browser: Browser;
    let cleanupPath = "";


    // const googleClockSearch = `https://www.google.de/search?q=clock&btnK=Google-Suche`;
    const googleClockSearch = `http://localhost:3000/delayed`;
    const conf: SeleniumConfig = {
        seleniumServerAddress: "http://localhost:4444/wd/hub",

        capabilities: {
            browserName: "chrome",
        }
    };

    const getFilesizeInBytes = (filename: string) => {
        return fs.statSync(filename)["size"];
    };


    beforeAll(async () => {
        await BrowserWdjs.cleanup();
        browser = BrowserWdjs.create(conf);
    });

    afterEach(() => {
        if(cleanupPath)
            fsExtra.remove(cleanupPath);

        cleanupPath ="";
    });
    afterAll(async () => {
        await BrowserWdjs.cleanup();
    }, 20000);

    describe('from a single browser as base64 string', () => {
        it('its possible to save it to a file - (test case id: 49abe605-e6be-4236-b43e-d2c2fc661455)', async () => {
            const testFolder = uuid.v1();
            const basePath = `${process.cwd()}/dist/${testFolder}`;
            cleanupPath = basePath;
            const filePath = `${basePath}/Screenshot.png`;

            await fsExtra.mkdirp(basePath);

            await browser.get(googleClockSearch);
            const imageBase64 = await browser.takeScreenshot();

            fs.writeFileSync(filePath, imageBase64, 'base64');

            expect(getFilesizeInBytes(filePath)).toBeGreaterThanOrEqual(30000);
        }, 30000);
    });

    describe('from a single browser and save it to a file', () => {
        it('should return the path to the saved screenshot when a absolute path is passed ' +
            '- (test case id: 49abe605-e6be-4236-b43e-d2c2fc661455)', async () => {
            const testFolder = uuid.v1();
            const basePath = `${process.cwd()}/dist/${testFolder}`;
            cleanupPath = basePath;
            const filename = `Screenshot.png`;

            await browser.get(googleClockSearch);
            const fn = await browser.saveScreenshot(basePath, filename);
            expect(getFilesizeInBytes(fn)).toBeGreaterThanOrEqual(30000);

        }, 30000);

        it('should return the path to the saved screenshot when an relative path is passed  ' +
            '- (test case id: 8759a97a-a564-4917-8e41-fd6feda8dac4)', async () => {
            const testFolder = uuid.v1();
            const basePath = `${process.cwd()}/dist/${testFolder}`;
            cleanupPath = basePath;

            const relativeBasePath = `dist/${testFolder}`;
            const filename = `Screenshot.png`;

            await browser.get(googleClockSearch);
            const fn = await browser.saveScreenshot(relativeBasePath, filename);
            expect(getFilesizeInBytes(`${basePath}/${filename}`)).toBeGreaterThanOrEqual(30000);
            expect(fn).toEqual(`${basePath}/${filename}`);
        },30000);

        it('should return the path to the saved screenshot when a relative deep path is passed  ' +
            '- (test case id: 8759a97a-a564-4917-8e41-fd6feda8dac4)', async () => {
            const testFolder = uuid.v1();
            cleanupPath = `dist/${testFolder}`;
            const relativeBasePath = `dist/${testFolder}/one/two/three/four`;
            const basePath = `${process.cwd()}/${relativeBasePath}`;

            const filename = `Screenshot.png`;

            await browser.get(googleClockSearch);
            const fn = await browser.saveScreenshot(relativeBasePath, filename);
            expect(getFilesizeInBytes(fn)).toBeGreaterThanOrEqual(30000);
            expect(fn).toEqual(`${basePath}/${filename}`);
        },30000);

        it('should throw an error when a path with invalid characters is passed' +
            '- (test case id: 6248a1af-c3d9-4184-8de4-f785dfce50fb)', async () => {
            const testFolder = uuid.v1();
            const basePath = `${process.cwd()}/dist/${testFolder}`;
            cleanupPath = basePath;
            const characterPath = `${basePath}/"§$%&`;
            const filename = `Screenshot.png`;

            await browser.get(googleClockSearch);
            await browser.saveScreenshot(characterPath, filename)
                .then(() => {
                    expect(false).toBeTruthy(`call to saveScreenshot should throw an error, but it doesnt`);
                })
                .catch((error:any) => {
                    expect(error.toString()).toMatch(/contains invalid (.*) path characters/, `Wrong error message thrown`);
                });
        },30000);
    });

    describe('from multiple browser as base64 string', () => {
        let browser2: Browser;

        beforeAll(() => {
            browser2 = BrowserWdjs.create(conf);
        });


        it('and only one browser is used, both data streams should be savable to a file ' +
            '- (test case id: 662919d7-241d-4b61-a161-eccb1c4d4c1f)', async () => {
            const testFolder = uuid.v1();
            const basePath = `${process.cwd()}/dist/${testFolder}`;
            cleanupPath = basePath;

            await fsExtra.mkdirp(basePath);

            await browser.get(googleClockSearch);
            const imagesBase64 = await BrowserWdjs.takeScreenshots();

            const filePath1 = `${basePath}/${imagesBase64[0].browserName}_Screenshot.png`;
            const filePath2 = `${basePath}/${imagesBase64[1].browserName}_Screenshot.png`;

            fs.writeFileSync(filePath1, imagesBase64[0].browserScreenshotData, 'base64');
            fs.writeFileSync(filePath2, imagesBase64[1].browserScreenshotData, 'base64');

            expect(getFilesizeInBytes(filePath1)).toBeGreaterThanOrEqual(30000, `Failed Size check for ${filePath1}`);
            expect(getFilesizeInBytes(filePath2)).toBeLessThanOrEqual(30000, `Failed Size check for ${filePath2}`);
        }, 30000);

        it('and both browser are used, both data streams should be savable to a file ' +
            '- (test case id: faf0ea1e-0fa8-4ed4-bb2d-15c03b2fad71)', async () => {
            const testFolder = uuid.v1();
            const basePath = `${process.cwd()}/dist/${testFolder}`;
            cleanupPath = basePath;

            await fsExtra.mkdirp(basePath);

            await Promise.all(
                [
                    browser.get(googleClockSearch),
                    browser2.get(googleClockSearch)]
            );

            const imagesBase64 = await BrowserWdjs.takeScreenshots();

            const filePath1 = `${basePath}/${imagesBase64[0].browserName}_Screenshot.png`;
            const filePath2 = `${basePath}/${imagesBase64[1].browserName}_Screenshot.png`;

            fs.writeFileSync(filePath1, imagesBase64[0].browserScreenshotData, 'base64');
            fs.writeFileSync(filePath2, imagesBase64[1].browserScreenshotData, 'base64');

            expect(getFilesizeInBytes(filePath1)).toBeGreaterThanOrEqual(30000, `Failed Size check for ${filePath1}`);
            expect(getFilesizeInBytes(filePath2)).toBeGreaterThanOrEqual(30000, `Failed Size check for ${filePath2}`);
        }, 30000);

    });

    describe('from multiple browser and save it to a file', () => {
        let browser2: Browser;

        beforeAll(() => {
            browser2 = BrowserWdjs.create(conf);
        });
        it('and only one browser is used, the files should be available on the file system ' +
            '- (test case id: b63cdcde-587a-45e3-b994-21f896b728d7)', async () => {
            const testFolder = uuid.v1();
            const basePath = `${process.cwd()}/dist/${testFolder}`;
            cleanupPath = basePath;

            await fsExtra.mkdirp(basePath);
            const baseFileName = "Screenshot.png";

            await browser.get(googleClockSearch);
            const screenshots = await BrowserWdjs.saveScreenshots(basePath, baseFileName);

            expect(screenshots[0]).toContain(`browser1_${baseFileName}`);
            expect(getFilesizeInBytes(screenshots[0])).toBeGreaterThanOrEqual(30000, `Failed Size check for ${screenshots[0]}`);
        }, 60000);
    });
});