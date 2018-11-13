import {Interaction} from "./Activities";
import {Actor} from "../Actor";
import {BrowseTheWeb} from "../abilities/BrowseTheWeb";

export class Navigate implements Interaction {

    public static to(url: string) {
        return new Navigate(url);
    }

    constructor(private url: string) {}

    performAs(actor: Actor): Promise<void> {
        return BrowseTheWeb.as(actor).navigate(this.url);
    }
}