import {TkSession} from "../../interface/TkSession";
import { Client } from "webdriver";

export interface SessionRefIO {[key: string]: string}

export class SessionIO implements TkSession{

    public static create(client: Client): SessionIO {
        // @ts-ignore
        return new SessionIO({sessionId: client.sessionId, capabilities: client.capabilities});
    }

    public getId(): string {
        return this.clientSession.sessionId;
    }

    private constructor(private clientSession: SessionRefIO) {

    }
}