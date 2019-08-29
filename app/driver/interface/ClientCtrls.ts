import {ServerConfig} from "../../config/ServerConfig";

export interface ClientCtrls<D> {
    // displayTestMessage(shallPrintMessage: boolean | undefined, testMessage: string): (client: D) => Promise<D>;
    // annotateElement: boolean | undefined;
    serverConfig: ServerConfig;
    getFrameWorkClient: () => Promise<D>;
    pointerButtonDown(button: number): (pr: Promise<void>) => Promise<void>;
    pointerButtonUp(button: number): (pr: Promise<void>) => Promise<void>;
    releaseActions(pr: Promise<void>): Promise<void>;
}