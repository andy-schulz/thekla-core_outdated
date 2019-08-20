import {TkSession} from "../../interface/TkSession";

export interface SessionRefIO {[key: string]: string}

export class SessionIO implements TkSession{

    public static create(clientSession: SessionRefIO) {
        return new SessionIO(clientSession);
    }

    public getId(): string {
        return this.clientSession.sessionId;
    }

    private constructor(private clientSession: SessionRefIO) {

    }
}