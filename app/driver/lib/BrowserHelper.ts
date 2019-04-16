import {DesiredCapabilities, SeleniumConfig} from "../../config/SeleniumConfig";
import {Browser}                             from "../interface/Browser";
import {BrowserWdjs}                         from "../wdjs/BrowserWdjs";

export class BrowserHelper {

    public withDesiredCapability(capabilities: DesiredCapabilities): Browser {
        return BrowserWdjs.create(this.config, capabilities);
    }

    public constructor(private config: SeleniumConfig) {
    }
}