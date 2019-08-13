import {Browser, BrowserScreenshotData} from "../../interface/Browser";

export const takeScreenshots = (clientMap: Map<string, Browser>): Promise<BrowserScreenshotData[]> => {
    return Promise.all(
        [...clientMap.keys()].map((browsername: string): Promise<BrowserScreenshotData> => {
            return new Promise((resolve, reject): void => {
                const browser = clientMap.get(browsername);
                if (browser) {
                    browser.takeScreenshot()
                        .then(resolve)
                        .catch(reject)
                } else {
                    reject(`Browser with name '${browser}' not found`);
                }
            })
        })
    )
};

export const saveScreenshots = (clientMap: Map<string, Browser>): (filepath: string, baseFileName: string) => Promise<string[]> => {
    return (filepath: string, baseFileName: string): Promise<string[]> => {
        return Promise.all(
            [...clientMap.keys()].map((browsername: string): Promise<string> => {
                return new Promise((resolve, reject): void => {
                    const browser = clientMap.get(browsername);
                    if (browser) {
                        browser.saveScreenshot(filepath, `${browsername}_${baseFileName}`)
                            .then(resolve)
                            .catch(reject)
                    } else {
                        reject(`Browser with name '${browser}' not found`);
                    }
                })
            })
        )
    }
};