import {ServerConfig} from "../../config/ServerConfig";
import {Point}        from "../lib/element/ElementLocation";

export interface ClientCtrls<D> {
    // displayTestMessage(shallPrintMessage: boolean | undefined, testMessage: string): (client: D) => Promise<D>;
    // annotateElement: boolean | undefined;
    serverConfig: ServerConfig;
    getFrameWorkClient: () => Promise<D>;
    pointerButtonDown(button: number): (client: D) => Promise<D>;
    pointerButtonUp(button: number): (client: D) => Promise<D>;
    movePointerTo(point: Point): (client: D) => Promise<D>;
    releaseActions(): (client: D) => Promise<D>;
}