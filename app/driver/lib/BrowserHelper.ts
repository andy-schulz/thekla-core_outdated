import {DesiredCapabilities, SeleniumConfig} from "../../config/SeleniumConfig";
import {Browser}                             from "../interface/Browser";
import {BrowserWdjs}                         from "../wdjs/BrowserWdjs";

export class BrowserHelper {

    public withDesiredCapability(capabilities: DesiredCapabilities): Promise<Browser> {
        return BrowserWdjs.create(this.config, capabilities);

    }

    constructor(private config: SeleniumConfig) {
    }
}