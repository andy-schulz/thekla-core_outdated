import {BrowseTheWeb, Interaction} from "../../../index";
import {UsesAbilities}             from "../../Actor";
import {stepDetails}               from "../../lib/decorators/StepDecorators";

export class Navigate implements Interaction<void, void> {

    public static to(url: string): Navigate {
        return new Navigate(url);
    }

    private constructor(private url: string) {}

    @stepDetails<UsesAbilities, void, void>(`navigate to: <<url>>`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return BrowseTheWeb.as(actor).navigate(this.url);
    }
}