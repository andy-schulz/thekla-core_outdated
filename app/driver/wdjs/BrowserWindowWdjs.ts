import {ISize, ThenableWebDriver} from "selenium-webdriver";
import {WindowConfig, WindowSize} from "../../config/SeleniumConfig";
import {BrowserWindow}            from "../interface/BrowserWindow";

export class BrowserWindowWdjs implements BrowserWindow{
    constructor(
        private _driver: ThenableWebDriver,
        private _windowConfig?: WindowConfig
    ) {

    }

    public static async create(driver: ThenableWebDriver,
                         windowConfig?: WindowConfig): Promise<BrowserWindow> {
        const window = new BrowserWindowWdjs(driver, windowConfig);

        if (windowConfig) {
            if (windowConfig.initialSize) {
                if(windowConfig.initialSize === "maximum") {
                    await window.maximize();
                } else if(windowConfig.initialSize.width && windowConfig.initialSize.height) {
                    await window.setSize(windowConfig.initialSize)
                }
            }
        }

        return Promise.resolve(window);
    }

    public maximize(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._driver.manage().window().maximize()
                .then(resolve)
                .catch(reject);
        })
    }

    public setSize(dimension: WindowSize = {width: 500, height: 500}): Promise<void> {
        return new Promise((resolve, reject) => {
            this._driver.manage().window().setSize(dimension.width, dimension.height)
                .then(resolve)
                .catch(reject)
        });
    }

    public getSize(): Promise<WindowSize> {
        return new Promise((resolve, reject) => {
            this._driver.manage().window().getSize()
                .then((s: ISize) =>resolve({width: s.width, height: s.height}))
                .catch(reject)
        })
    }

}