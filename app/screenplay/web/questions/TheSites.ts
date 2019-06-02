import {Question}      from "../../lib/questions/Question";
import {UsesAbilities} from "../../Actor";
import {BrowseTheWeb}  from "../../../index";

class SiteUrl implements Question<void, string> {
    public answeredBy(actor: UsesAbilities): Promise<string> {
        return BrowseTheWeb.as(actor).getCurrentUrl();
    }
}

class SiteTitle implements Question<void, string> {
    public answeredBy(actor: UsesAbilities): Promise<string> {
        return BrowseTheWeb.as(actor).getTitle();
    }
}

export class TheSites {
    public static url(): SiteUrl  {
        return new SiteUrl()
    }

    public static title(): SiteTitle  {
        return new SiteTitle()
    }
}