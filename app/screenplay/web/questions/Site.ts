import {Question}            from "../../lib/matcher/Question";
import {UsesAbilities}       from "../../Actor";
import {BrowseTheWeb}        from "../../../index";

export class TheSites {
    static url(): SiteUrl  {
        return new SiteUrl()
    }

    static title(): SiteTitle  {
        return new SiteTitle()
    }
}

class SiteUrl implements Question<string> {
    answeredBy(actor: UsesAbilities): Promise<string> {
        return BrowseTheWeb.as(actor).getCurrentUrl();
    }
}

class SiteTitle implements Question<string> {
    answeredBy(actor: UsesAbilities): Promise<string> {
        return BrowseTheWeb.as(actor).getTitle();
    }
}