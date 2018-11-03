import {WebFinder} from "./WebElements";

export interface Browser extends WebFinder{
    get(url: string): Promise<any>;
    quit(): Promise<void>;
}