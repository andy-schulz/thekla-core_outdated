import {BrowseTheWeb, Interaction} from "../../";
import {UsesAbilities}             from "../Actor";

export class Navigate implements Interaction {

    public static to(url: string) {
        return new Navigate(url);
    }

    constructor(private url: string) {}

    performAs(actor: UsesAbilities): Promise<void> {
        return BrowseTheWeb.as(actor).navigate(this.url);
    }
}