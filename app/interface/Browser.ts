import {WebFinder} from "./WebElements";
import {Config} from "./Config";
import {BrowserWdjs} from "../src/wdjs/BrowserWdjs";
import {Condition, ConditionElement} from "./Condition";

export interface Browser extends WebFinder{
    get(url: string): Promise<any>;
    quit(): Promise<void>;
    wait(condition: Condition, timeout?: number, errorMessage?: string): Promise<string>;
}

export class BrowserFactory {

    public static create(config: Config, framework: string): Promise<Browser> {
        if(framework == "wdjs") {
            return BrowserWdjs.create(config);
        } else {
            throw Promise.reject(`Error: Framework ${framework} not implemented`);
        }
    }
}