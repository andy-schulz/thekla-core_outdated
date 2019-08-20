import {WindowConfig}                          from "../../config/DesiredCapabilities";
import {BrowserWindow, WindowSize} from "../interface/BrowserWindow";
import { Client }                   from 'webdriver'

export class BrowserWindowWdio implements BrowserWindow{
    private constructor(
        private getClient: () => Promise<Client>,
        private _windowConfig?: WindowConfig
    ) {

    }

    public static create(getClient: () => Promise<Client>, windowConfig?: WindowConfig): BrowserWindow {
        return new BrowserWindowWdio(getClient, windowConfig);
    }

    public setToPreset(): Promise<void> {
        if (this._windowConfig && this._windowConfig.setToMaxSize) {
            return this.maximize();
        }
        return Promise.resolve()
    }

    public maximize(): Promise<void> {
        return this.getClient()
            .then((client: Client): Promise<void> => {
                return client.maximizeWindow() as unknown as Promise<void>
            })
    }

    public setSize(dimension: WindowSize = {width: 500, height: 500}): Promise<void> {
        return this.getClient()
            .then((client: Client): Promise<void> => {
                // @ts-ignore
                if(client.isW3C)
                    return client.setWindowRect(null, null, dimension.width, dimension.height) as unknown as Promise<void>;

                return client._setWindowSize(dimension.width, dimension.height) as unknown as Promise<void>
            })
    }

    public getSize(): Promise<WindowSize> {
        return this.getClient()
            .then((client: Client) => {
                // @ts-ignore
                if(client.isW3C)
                    return client.getWindowRect();
                return client._getWindowSize();
            })
            .then((s: any): any => {
                return {width: s.width, height: s.height}

            })
    }
}