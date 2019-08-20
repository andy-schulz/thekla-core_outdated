import {Session}   from "selenium-webdriver";
import {TkSession} from "../../interface/TkSession";

export class SessionJS implements TkSession{
    public static create(session: Session) {
        return new SessionJS(session);
    }

    public getId(): string {
        return this.session.getId();
    }

    private constructor(private session: Session) {

    }
}