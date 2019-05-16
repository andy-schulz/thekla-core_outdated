import {ISize, promise, WebDriver} from "selenium-webdriver";
import {WindowConfig}              from "../../config/DesiredCapabilities";
import {BrowserWindow, WindowSize} from "../interface/BrowserWindow";

export class BrowserWindowWdjs implements BrowserWindow{
    private constructor(
        private getDriver: () => Promise<WebDriver>,
        private _windowConfig?: WindowConfig
    ) {

    }

    public static create(getDriver: () => Promise<WebDriver>, windowConfig?: WindowConfig): BrowserWindow {
        return new BrowserWindowWdjs(getDriver, windowConfig);
    }

    public setToPreset(): Promise<void> {
        if (this._windowConfig && this._windowConfig.setToMaxSize) {
            return this.maximize();
        }
        return Promise.resolve()
    }

    public maximize(): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.getDriver()
                .then((driver: WebDriver): promise.Promise<void> => driver.manage().window().maximize())
                .then(resolve)
                .catch(reject);
        })
    }

    public setSize(dimension: WindowSize = {width: 500, height: 500}): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.getDriver()
                .then((driver: WebDriver): promise.Promise<void> =>
                    driver.manage().window().setSize(dimension.width, dimension.height))
                .then(resolve)
                .catch(reject)
        });
    }

    public getSize(): Promise<WindowSize> {
        return new Promise((resolve, reject): void => {
            this.getDriver()
                .then((driver: WebDriver): promise.Promise<ISize> => driver.manage().window().getSize())
                .then((s: ISize): void => resolve({width: s.width, height: s.height}))
                .catch(reject)
        })
    }

}